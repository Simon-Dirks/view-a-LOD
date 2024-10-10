import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Settings } from '../config/settings';
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
import {
  ElasticSortEntryModel,
  ElasticSortOrder,
} from '../models/elastic/elastic-sort.model';
import { SortService } from './sort.service';

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
  ): (ElasticQuery | ElasticFieldExistsQuery)[] {
    const fieldOrValueFilters = filters.filter(
      (filter) =>
        filter.type === FilterType.Value || filter.type === FilterType.Field,
    );

    return fieldOrValueFilters.map((filter) => {
      if (filter.type === FilterType.Field) {
        return this._getFieldExistsQuery(filter?.fieldId);
      }
      return this.getQuery(filter?.valueId);
    });
  }

  async getFilterOptions(
    query: string,
    filterFieldIds: string[],
    activeFilters: FilterModel[],
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

    const queryData = this._getNodeSearchQuery(query, activeFilters, 0, 0);
    queryData.aggs = { ...aggs };

    return await this.searchEndpoints(queryData);
  }

  private getFieldAndValueFilterQueries(
    filters: FilterModel[],
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
        match_phrase: { [fieldIdWithSpaces]: filter.valueId },
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

    // TODO: Support multiple fields
    const elasticSortEntry: ElasticSortEntryModel = {};
    const elasticSortOrder: ElasticSortOrder =
      sort.order === SortOrder.Ascending ? 'asc' : 'desc';

    elasticSortEntry[sort.field] = {
      order: elasticSortOrder,
      unmapped_type: 'string',
    };

    return [elasticSortEntry];
  }

  private _getNodeSearchQuery(
    query: string,
    filters: FilterModel[],
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

    const elasticSortEntries = this._getElasticSortEntriesFromSortOption();
    const shouldSort = elasticSortEntries && elasticSortEntries.length > 0;
    if (shouldSort) {
      queryData.sort = elasticSortEntries;
    }

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

    if (mustQueries && mustQueries.length > 0) {
      queryData.query.bool.must = mustQueries;
    }
    return queryData;
  }

  async searchNodes(
    query: string,
    from: number,
    size: number,
    filters: FilterModel[],
  ): Promise<ElasticEndpointSearchResponse<ElasticNodeModel>[]> {
    const queryData = this._getNodeSearchQuery(query, filters, from, size);

    return await this.searchEndpoints<ElasticNodeModel>(queryData);
  }
}
