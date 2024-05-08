import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterModel, FilterType } from '../../models/filter.model';
import {
  FilterOptionModel,
  FilterOptionsModel,
} from '../../models/filter-option.model';
import { Settings } from '../../config/settings';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { FieldDocCountsModel } from '../../models/elastic/field-doc-counts.model';
import { ElasticAggregationModel } from '../../models/elastic/elastic-aggregation.model';
import { ElasticService } from '../elastic.service';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  enabled: BehaviorSubject<FilterModel[]> = new BehaviorSubject<FilterModel[]>(
    [],
  );
  options: BehaviorSubject<FilterOptionsModel> =
    new BehaviorSubject<FilterOptionsModel>({
      type: {
        label: 'Soort',
        fieldIds: Settings.predicates.type,
        valueIds: [],
      },
      parents: {
        label: 'Is onderdeel van',
        fieldIds: Settings.predicates.parents,
        valueIds: [],
      },
    });

  constructor(
    public elastic: ElasticService,
    public data: DataService,
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
    const docCounts = this._getFieldDocCountsFromResponses(responses);

    for (const [_, filter] of Object.entries(this.options.value)) {
      const filterValueIds: string[] = filter.fieldIds.flatMap((fieldId) => {
        const elasticFieldId = this.data.replacePeriodsWithSpaces(fieldId);
        // TODO: Save counts here as well, instead of only keys
        const valueIdsForField =
          docCounts?.[elasticFieldId]?.map((d) => d.key) ?? [];
        return valueIdsForField;
      });
      filter.valueIds = filterValueIds;
    }
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

  has(id: string, type: FilterType): boolean {
    // TODO: Reduce calls to this function if needed for performance reasons
    return (
      this.enabled.value.find((f) => f.valueId === id && f.type === type) !==
      undefined
    );
  }

  getOptionById(filterId: string): FilterOptionModel {
    return this.options.value?.[filterId];
  }
}
