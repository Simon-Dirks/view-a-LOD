import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { hasImageFilters, Settings } from '../config/settings';
import { ElasticNodeModel } from '../models/elastic/elastic-node.model';
import { FilterModel, FilterType } from '../models/filter.model';
import { ElasticQuery } from '../models/elastic/elastic-query.type';
import { ElasticFieldExistsQuery } from '../models/elastic/elastic-field-exists-query.type';
import { DataService } from './data.service';
import { ElasticMatchQueries } from '../models/elastic/elastic-match-queries.type';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { Config } from '../config/config';
import { SettingsService } from './settings.service';
import { EndpointService } from './endpoint.service';
import { ElasticEndpointSearchResponse } from '../models/elastic/elastic-endpoint-search-response.type';
import { ElasticShouldQueries } from '../models/elastic/elastic-should-queries.type';
import { SortOrder } from '../models/settings/sort-order.enum';
import { ElasticSortEntryModel } from '../models/elastic/elastic-sort.model';
import { SortService } from './sort.service';
import { FilterOptionsIdsModel } from '../models/filter-option.model';

@Injectable({
  providedIn: 'root',
})
export class ElasticService {
  constructor(
    private api: ApiService,
    private data: DataService,
    private settings: SettingsService,
    private endpoints: EndpointService,
    private sort: SortService,
  ) {}

  private _getSearchQuery(query: string): ElasticQuery {
    return this.getQuery(query);
  }

  private getQuery(
    query?: string,
    field?: string,
    boost?: number,
  ): ElasticQuery {
    if (!query) {
      query = '';
    }

    const elasticQuery: ElasticQuery = {
      query_string: {
        query: query,
        boost: boost,
      },
    };
    if (field) {
      elasticQuery.query_string.fields = [field];
    }
    return elasticQuery;
  }

  private _getFieldExistsQuery(
    fieldId?: string,
    boost?: number,
  ): ElasticFieldExistsQuery {
    if (!fieldId) {
      fieldId = '';
    }
    return {
      exists: {
        field: this.data.replacePeriodsWithSpaces(fieldId),
        boost: boost,
      },
    };
  }

  private _getFieldOrValueFilterQueries(
    filters: FilterModel[],
    boost?: number,
  ): (ElasticQuery | ElasticFieldExistsQuery)[] {
    const fieldOrValueFilters = filters.filter(
      (filter) =>
        filter.type === FilterType.Value || filter.type === FilterType.Field,
    );

    return fieldOrValueFilters.map((filter) => {
      if (filter.type === FilterType.Field) {
        return this._getFieldExistsQuery(filter?.fieldId, boost);
      }
      return this.getQuery(filter?.valueId, undefined, boost);
    });
  }

  async getFilterOptions(
    query: string,
    filterFieldIds: string[],
    activeFilters: FilterModel[],
    onlyWithImages: boolean,
  ): Promise<SearchResponse<any>[]> {
    const aggs = filterFieldIds.reduce((result: any, fieldId) => {
      const elasticFieldId = this.data.replacePeriodsWithSpaces(fieldId);

      // TODO: Find way to retrieve ALL hit IDs here if we want to show the full count for the filter options
      //  Now using top_hits to prevent many separate requests
      //  Relatively easy fix: update [index.max_inner_result_window] on elastic to 10.000"
      result[elasticFieldId] = {
        terms: {
          field: elasticFieldId + '.keyword',
          min_doc_count:
            Settings.filtering.minNumOfValuesForFilterOptionToAppear,
          size: Config.maxNumOfFilterOptionsPerField,
        },
        aggs: {
          field_hits: {
            top_hits: {
              size: Config.elasticTopHitsMax,
              _source: '',
            },
          },
        },
      };
      return result;
    }, {});

    const queryData = this._getNodeSearchQuery(
      query,
      activeFilters,
      onlyWithImages,
      0,
      0,
    );
    queryData.aggs = { ...aggs };

    return await this.searchEndpoints(queryData);
  }

  getFieldAndValueFilterQueries(
    filters: FilterModel[],
    boost?: number,
  ): ElasticShouldQueries[] {
    const fieldAndValueFilters = filters.filter(
      (filter) =>
        filter.type === FilterType.FieldAndValue &&
        filter.fieldId !== undefined,
    );

    let matchQueries: { [filterId: string]: ElasticMatchQueries[] } = {};
    fieldAndValueFilters.forEach((filter) => {
      if (!filter.fieldId || !filter.valueId) {
        return;
      }
      const fieldIdWithSpaces = this.data.replacePeriodsWithSpaces(
        filter.fieldId,
      );
      const matchQuery: ElasticMatchQueries = {
        match_phrase: {
          [fieldIdWithSpaces]: { query: filter.valueId, boost: boost },
        },
      };
      const filterId = filter?.filterId ?? 'Filter';
      if (!(filterId in matchQueries)) {
        matchQueries[filterId] = [];
      }
      matchQueries[filterId].push(matchQuery);
    });

    const shouldMatchQueries: ElasticShouldQueries[] = Object.values(
      matchQueries,
    ).map((queries) => {
      return { bool: { should: queries } };
    });
    return shouldMatchQueries;
  }

  async searchEndpoints<T>(
    queryData: any,
  ): Promise<ElasticEndpointSearchResponse<T>[]> {
    const searchPromisesAndEndpoints: {
      promise: Promise<SearchResponse<T>>;
      endpointId: string;
    }[] = [];
    for (const endpoint of this.endpoints.getAllUrls()) {
      if (!endpoint.elastic) {
        continue;
      }

      const searchPromise: Promise<SearchResponse<T>> = this.api.postData<
        SearchResponse<T>
      >(endpoint.elastic, queryData);

      searchPromisesAndEndpoints.push({
        promise: searchPromise,
        endpointId: endpoint?.id ?? 'N/A',
      });
    }

    const searchPromises: Promise<SearchResponse<T>>[] =
      searchPromisesAndEndpoints.map((s) => s.promise);
    const searchResults: SearchResponse<T>[] =
      await Promise.all(searchPromises);

    const searchResultsWithEndpointIds: ElasticEndpointSearchResponse<T>[] =
      searchResults.map((searchResult, index) => ({
        ...searchResult,
        endpointId: searchPromisesAndEndpoints[index].endpointId,
      }));
    return searchResultsWithEndpointIds;
  }

  private _getElasticSortEntriesFromSortOption(): ElasticSortEntryModel[] {
    const sort = this.sort.current.value;
    if (!sort) {
      return [];
    }

    const elasticSortEntries: ElasticSortEntryModel[] = sort.fields.map(
      (field) => {
        const elasticField =
          this.data.replacePeriodsWithSpaces(field) + '.keyword';
        return {
          [elasticField]: {
            order: sort.order === SortOrder.Ascending ? 'asc' : 'desc',
            unmapped_type: 'string',
          },
        };
      },
    );

    return elasticSortEntries;
  }

  private _getNodeSearchQuery(
    query: string,
    filters: FilterModel[],
    onlyWithImages: boolean,
    from?: number,
    size?: number,
  ): any {
    const queryData: any = {
      from: from,
      size: size,
      query: {
        bool: {},
      },
    };

    // Sorting
    const elasticSortEntries = this._getElasticSortEntriesFromSortOption();
    const shouldSort = elasticSortEntries && elasticSortEntries.length > 0;
    if (shouldSort) {
      queryData.sort = elasticSortEntries;
    }

    // Search filters
    let searchFilters: FilterModel[] = filters;

    const fieldOrValueFilterQueries: (
      | ElasticQuery
      | ElasticFieldExistsQuery
    )[] = this._getFieldOrValueFilterQueries(searchFilters);

    if (query) {
      const searchQuery = this._getSearchQuery(query);
      fieldOrValueFilterQueries.push(searchQuery);
    }

    const fieldAndValueFilterQueries =
      this.getFieldAndValueFilterQueries(searchFilters);

    const mustQueries: ElasticShouldQueries[] = [...fieldAndValueFilterQueries];
    if (fieldOrValueFilterQueries && fieldOrValueFilterQueries.length > 0) {
      mustQueries.push({ bool: { should: fieldOrValueFilterQueries } });
    }

    // Has image filter
    const hasImageFilterQueries =
      this._getFieldOrValueFilterQueries(hasImageFilters);
    const useHasImageFilter =
      onlyWithImages &&
      hasImageFilterQueries &&
      hasImageFilterQueries.length > 0;
    if (useHasImageFilter) {
      mustQueries.push({ bool: { should: hasImageFilterQueries } });
    }

    if (mustQueries && mustQueries.length > 0) {
      queryData.query.bool.must = mustQueries;
    }

    // Hiding filters (e.g., hiding terms)
    const hideFilters = this.data.convertFiltersFromIdsFormat(
      Settings.alwaysHideNodes as FilterOptionsIdsModel,
    );
    const hideQueries: ElasticShouldQueries[] =
      this.getFieldAndValueFilterQueries(hideFilters);
    if (hideQueries && hideQueries.length > 0) {
      queryData.query.bool.must_not = hideQueries;
    }

    // Boosting filters
    const boostSettings = this.sort.current.value?.boost;
    if (!boostSettings) {
      return queryData;
    }
    let boostQueries: (
      | ElasticQuery
      | ElasticFieldExistsQuery
      | ElasticMatchQueries
    )[] = [];
    for (const [id, boostSetting] of Object.entries(boostSettings)) {
      const boostFilters = this.data.convertFiltersFromIdsFormat({
        [id]: boostSetting.filter,
      });
      const boostFieldOrValueQueries = this._getFieldOrValueFilterQueries(
        boostFilters,
        boostSetting.boost,
      );
      const boostFieldAndValueQueries = this.getFieldAndValueFilterQueries(
        boostFilters,
        boostSetting.boost,
      ).flatMap((f) => f.bool.should);
      boostQueries = [
        ...boostQueries,
        ...boostFieldOrValueQueries,
        ...boostFieldAndValueQueries,
      ];
    }
    if (boostQueries && boostQueries.length > 0) {
      // TODO: Fix issue with less results showing when including boost queries (e.g. empty search)
      queryData.query.bool.should = boostQueries;
    }

    return queryData;
  }

  async searchNodes(
    query: string,
    from: number,
    size: number,
    filters: FilterModel[],
    onlyWithImages: boolean,
  ): Promise<ElasticEndpointSearchResponse<ElasticNodeModel>[]> {
    const queryData = this._getNodeSearchQuery(
      query,
      filters,
      onlyWithImages,
      from,
      size,
    );

    return await this.searchEndpoints<ElasticNodeModel>(queryData);
  }
}
