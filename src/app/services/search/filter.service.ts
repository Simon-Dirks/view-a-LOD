import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterModel, FilterType } from '../../models/filter.model';
import {
  FilterOptionModel,
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

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  enabled: BehaviorSubject<FilterModel[]> = new BehaviorSubject<FilterModel[]>(
    [],
  );
  options: BehaviorSubject<FilterOptionsModel> =
    new BehaviorSubject<FilterOptionsModel>(Settings.filtering.filterOptions);

  constructor(
    public elastic: ElasticService,
    public data: DataService,
    public clusters: ClusterService,
  ) {}

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

  async updateFilterOptionValues(query: string) {
    const allFilterFieldIds: string[] = Object.values(
      this.options.value,
    ).flatMap((filterOption) => filterOption.fieldIds);

    const responses: SearchResponse<any>[] =
      await this.elastic.getFilterOptions(allFilterFieldIds, query);
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
    const enabledFilters = this.enabled.value;
    for (const filter of filters) {
      const existingFilterIdx = enabledFilters.findIndex(
        (f) =>
          f.valueId === filter.valueId &&
          f.fieldId === filter.fieldId &&
          f.type === filter.type,
      );
      const filterAlreadyExists = existingFilterIdx > -1;
      if (filterAlreadyExists) {
        enabledFilters.splice(existingFilterIdx, 1);
      } else {
        enabledFilters.push(filter);
      }
    }

    this.enabled.next(enabledFilters);
  }

  toggle(filter: FilterModel) {
    this.toggleMultiple([filter]);
  }

  has(ids: string[], type: FilterType): boolean {
    // TODO: Reduce calls to this function if needed for performance reasons
    return (
      this.enabled.value.find(
        (f) => f.valueId && ids.includes(f.valueId) && f.type === type,
      ) !== undefined
    );
  }

  getOptionById(filterId: string): FilterOptionModel {
    return this.options.value?.[filterId];
  }

  getOptionValueIds(filterId: string): string[] {
    // TODO: Reduce number of calls if necessary for performance reasons
    return this.getOptionById(filterId).values.flatMap((v) => v.ids);
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
}
