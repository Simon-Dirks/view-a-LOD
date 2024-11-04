import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterModel, FilterType } from '../../models/filter.model';
import {
  FilterOptionModel,
  FilterOptionsIdsModel,
  FilterOptionsModel,
  FilterOptionValueModel,
} from '../../models/filter-option.model';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { FieldDocCountsModel } from '../../models/elastic/field-doc-counts.model';
import {
  DocCountModel,
  ElasticAggregationModel,
} from '../../models/elastic/elastic-aggregation.model';
import { ElasticService } from '../elastic.service';
import { DataService } from '../data.service';
import { Settings } from '../../config/settings';
import { ClusterService } from '../cluster.service';
import { Router } from '@angular/router';

interface SearchTriggerModel {
  clearFilters: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  searchTrigger: EventEmitter<SearchTriggerModel> =
    new EventEmitter<SearchTriggerModel>();

  prevEnabled: FilterModel[] = [];
  enabled: BehaviorSubject<FilterModel[]> = new BehaviorSubject<FilterModel[]>(
    [],
  );
  options: BehaviorSubject<FilterOptionsModel> =
    new BehaviorSubject<FilterOptionsModel>(Settings.filtering.filterOptions);

  onlyShowResultsWithImages: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    public elastic: ElasticService,
    public data: DataService,
    public clusters: ClusterService,
    public router: Router,
  ) {
    this._initRestorePreviousFiltersOnOptionsChange();
  }

  private _getFieldDocCountsFromResponses(
    responses: SearchResponse<any>[],
  ): FieldDocCountsModel {
    const docCountsByFieldId: FieldDocCountsModel = {};

    for (const response of responses) {
      const aggregations = response.aggregations;
      if (!aggregations) {
        continue;
      }

      for (const [elasticFieldId, aggregationsAggregate] of Object.entries(
        aggregations,
      )) {
        const aggregationsData =
          aggregationsAggregate as ElasticAggregationModel;
        for (const docCount of aggregationsData.buckets) {
          const hitIds = docCount?.field_hits?.hits?.hits?.map((h) => h?._id);
          docCount.hitIds = hitIds ?? [];

          if (!(elasticFieldId in docCountsByFieldId)) {
            docCountsByFieldId[elasticFieldId] = [];
          }
          docCountsByFieldId[elasticFieldId].push(docCount);
        }
      }
    }
    return docCountsByFieldId;
  }

  private _initRestorePreviousFiltersOnOptionsChange() {
    this.options.subscribe((newOptions) => {
      this._restorePreviousFilters();
    });
  }

  private _filterExistsInOptions(filter: FilterModel): boolean {
    const options = this.options.value;
    const filterId = filter?.filterId;
    if (!filterId) {
      console.warn('No filter ID defined', filter);
      return false;
    }
    const isUnknownFilterType =
      filter.type !== FilterType.Field &&
      filter.type !== FilterType.Value &&
      filter.type !== FilterType.FieldAndValue;
    if (isUnknownFilterType) {
      console.warn(
        'Unknown filter type, enabled filter not checked against current options',
      );
      return false;
    }

    let filterExistsInOptions = false;
    const fieldExistsInOptions = !!(
      filter.fieldId && options[filterId].fieldIds.includes(filter.fieldId)
    );
    const valueExistsInOptions = options[filterId].values.some(
      (a) => filter.valueId && a.ids.includes(filter.valueId),
    );

    const fieldFilterExistsInOptions =
      filter.type === FilterType.Field && fieldExistsInOptions;
    const valueFilterExistsInOptions =
      filter.type === FilterType.Value && valueExistsInOptions;
    const fieldAndValueFilterExistsInOptions =
      filter.type === FilterType.FieldAndValue &&
      fieldExistsInOptions &&
      valueExistsInOptions;
    if (
      fieldFilterExistsInOptions ||
      valueFilterExistsInOptions ||
      fieldAndValueFilterExistsInOptions
    ) {
      filterExistsInOptions = true;
    }

    return filterExistsInOptions;
  }

  private _restorePreviousFilters() {
    const restoredFilters = this.prevEnabled.filter((prevEnabledFilter) =>
      this._filterExistsInOptions(prevEnabledFilter),
    );

    const shouldUpdateEnabledFilters =
      JSON.stringify(restoredFilters) !== JSON.stringify(this.enabled.value);
    if (shouldUpdateEnabledFilters) {
      console.log(
        'Restoring previously applied filters and triggering new search with these filters:',
        restoredFilters,
        this.enabled.value,
      );
      this.enabled.next(restoredFilters);
      this.searchTrigger.emit({ clearFilters: false });
    }
  }

  onUpdateFromURLParam(filtersParam: string) {
    console.log(
      'Update filters based on URL param:',
      filtersParam.slice(0, 100),
      '...',
    );
    const urlFilters: FilterOptionsIdsModel = JSON.parse(filtersParam);
    const filters: FilterModel[] =
      this.data.convertFiltersFromIdsFormat(urlFilters);

    this.enabled.next(filters);
  }

  async updateFilterOptionValues(query: string) {
    const allFilterFieldIds: string[] = Object.values(
      this.options.value,
    ).flatMap((filterOption) => filterOption.fieldIds);

    const responses: SearchResponse<any>[] =
      await this.elastic.getFilterOptions(
        query,
        allFilterFieldIds,
        this.enabled.value,
        this.onlyShowResultsWithImages.value,
      );
    const docCounts: FieldDocCountsModel =
      this._getFieldDocCountsFromResponses(responses);

    const filterOptions = this.options.value;
    for (const [_, filter] of Object.entries(filterOptions)) {
      const filterValuesMap = new Map<string, string[]>();

      filter.fieldIds.forEach((fieldId) => {
        const elasticFieldId = this.data.replacePeriodsWithSpaces(fieldId);
        const docCountsForField: DocCountModel[] =
          docCounts?.[elasticFieldId] ?? [];
        const docCountsToShow: DocCountModel[] = docCountsForField.filter(
          (d) => {
            const valueId = d.key;
            const shouldHideValueId = filter.hideValueIds?.includes(valueId);
            if (!filter.showOnlyValueIds) {
              return !shouldHideValueId;
            }

            return filter.showOnlyValueIds.includes(valueId);
          },
        );
        docCountsToShow.forEach((d) => {
          const id = d.key;
          const hitIds = d.hitIds;

          if (filterValuesMap.has(id)) {
            filterValuesMap.set(id, filterValuesMap.get(id)!.concat(hitIds));
          } else {
            filterValuesMap.set(id, hitIds);
          }
        });
      });
      const filterValues: FilterOptionValueModel[] = Array.from(
        filterValuesMap,
      ).map(([id, filterHitIds]) => ({
        ids: [id],
        filterHitIds: filterHitIds,
      }));

      const clusteredFilterValues =
        this.clusters.clusterFilterOptionValues(filterValues);
      filter.values = clusteredFilterValues;
    }
    this.options.next(filterOptions);
  }

  toggleMultiple(filters: FilterModel[]) {
    const updatedEnabledFilters = this.enabled.value;
    for (const filter of filters) {
      const existingFilterIdx = updatedEnabledFilters.findIndex(
        (f) =>
          f.valueId === filter.valueId &&
          f.fieldId === filter.fieldId &&
          f.type === filter.type,
      );
      const filterAlreadyExists = existingFilterIdx > -1;
      if (filterAlreadyExists) {
        updatedEnabledFilters.splice(existingFilterIdx, 1);
      } else {
        updatedEnabledFilters.push(filter);
      }
    }

    console.log(
      'Toggled filter, triggering new search (where filters will be temporarily cleared)',
    );
    this.enabled.next(updatedEnabledFilters);
    this.searchTrigger.emit({ clearFilters: true });
  }

  toggle(filter: FilterModel) {
    this.toggleMultiple([filter]);
  }

  has(valueIds: string[], type: FilterType): boolean {
    // TODO: Reduce calls to this function if needed for performance reasons
    // TODO: Make sure this works with other filter types (e.g. filtering on only Field or only Value)
    return (
      this.enabled.value.find(
        (f) => f.valueId && valueIds.includes(f.valueId) && f.type === type,
      ) !== undefined
    );
  }

  getOptionById(filterId: string): FilterOptionModel {
    return this.options.value?.[filterId];
  }

  private _getOptionValueIds(filterId: string): string[] {
    // TODO: Reduce number of calls if necessary for performance reasons
    return this.getOptionById(filterId).values.flatMap((v) => v.ids);
  }

  shouldShow(filterId: string): boolean {
    const hasOptionsToShow = this._getOptionValueIds(filterId).length > 0;
    const option: FilterOptionModel = this.getOptionById(filterId);

    if (!option.showOnlyForSelectedFilters) {
      return hasOptionsToShow;
    }

    const showOnlyForSelectedFilters: FilterOptionsIdsModel =
      option.showOnlyForSelectedFilters;

    return (
      hasOptionsToShow &&
      this._shouldShowBasedOnFilters(showOnlyForSelectedFilters)
    );
  }

  private _shouldShowBasedOnFilters(
    showOnlyForSelectedFilters: FilterOptionsIdsModel,
  ): boolean {
    const enabledFilters: FilterOptionsIdsModel =
      this.data.convertFiltersToIdsFormat(this.enabled.value);
    for (const enabledFilter of Object.values(enabledFilters)) {
      for (const showOnlyForSelectedFilter of Object.values(
        showOnlyForSelectedFilters,
      )) {
        const hasFieldIdOverlap = this.data.hasOverlap(
          enabledFilter.fieldIds,
          showOnlyForSelectedFilter.fieldIds,
        );
        const hasValueIdOverlap = this.data.hasOverlap(
          enabledFilter.valueIds,
          showOnlyForSelectedFilter.valueIds,
        );

        switch (showOnlyForSelectedFilter.type) {
          case FilterType.Field:
            if (hasFieldIdOverlap) return true;
            break;
          case FilterType.Value:
            if (hasValueIdOverlap) return true;
            break;
          case FilterType.FieldAndValue:
            if (hasFieldIdOverlap && hasValueIdOverlap) return true;
            break;
          default:
            break;
        }
      }
    }
    return false;
  }

  getEnabledFiltersCountStr(count: number): string | undefined {
    if (count >= 1) {
      return count.toString();
    }
    //
    // if (count > 1) {
    //   return `${count} filters`;
    // }
    // if (count === 1) {
    //   return `${count} filter`;
    // }
    return undefined;
  }

  getOptionEnabledFiltersCount(
    filterId: string,
    type: FilterType,
  ): string | undefined {
    const optionValues: FilterOptionValueModel[] =
      this.getOptionById(filterId).values;
    const count = optionValues.reduce(
      (acc, optionValue) => acc + (this.has(optionValue.ids, type) ? 1 : 0),
      0,
    );

    return this.getEnabledFiltersCountStr(count);
  }

  clearEnabled() {
    this.prevEnabled = this.enabled.value;
    console.log(
      'Clearing enabled filters, saved current filters',
      this.prevEnabled,
    );
    this.enabled.next([]);
  }
}
