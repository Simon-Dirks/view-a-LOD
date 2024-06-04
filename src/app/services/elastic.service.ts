import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Settings } from '../config/settings';
import { ElasticNodeModel } from '../models/elastic/elastic-node.model';
import { FilterModel, FilterType } from '../models/filter.model';
import { ElasticSimpleQuery } from '../models/elastic/elastic-simple-query.type';
import { ElasticFieldExistsQuery } from '../models/elastic/elastic-field-exists-query.type';
import { DataService } from './data.service';
import { ElasticMatchQueries } from '../models/elastic/elastic-match-queries.type';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { Config } from '../config/config';
import { SettingsService } from './settings.service';
import { EndpointService } from './endpoint.service';
import { ElasticEndpointSearchResponse } from '../models/elastic/elastic-endpoint-search-response.type';
import { ElasticShouldQueries } from '../models/elastic/elastic-should-queries.type';

@Injectable({
  providedIn: 'root',
})
export class ElasticService {
  constructor(
    private api: ApiService,
    private data: DataService,
    private settings: SettingsService,
    private endpoints: EndpointService,
  ) {}

  private _getSearchQuery(query: string): ElasticSimpleQuery {
    return this._getSimpleQuery(query);
  }

  private _getSimpleQuery(
    query?: string,
    field?: string,
    boost?: number,
  ): ElasticSimpleQuery {
    if (!query) {
      query = '';
    }

    const simpleQuery: ElasticSimpleQuery = {
      simple_query_string: {
        query: query,
        boost: boost,
      },
    };
    if (field) {
      simpleQuery.simple_query_string.fields = [field];
    }
    return simpleQuery;
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
  ): (ElasticSimpleQuery | ElasticFieldExistsQuery)[] {
    const fieldOrValueFilters = filters.filter(
      (filter) =>
        filter.type === FilterType.Value || filter.type === FilterType.Field,
    );

    return fieldOrValueFilters.map((filter) => {
      if (filter.type === FilterType.Field) {
        return this._getFieldExistsQuery(filter?.fieldId);
      }
      return this._getSimpleQuery(filter?.valueId);
    });
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

  async getFilterOptions(
    filterFieldIds: string[],
    query: string,
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

    const queryData: any = {
      size: 0,
      aggs: { ...aggs },
    };

    if (query) {
      const searchQuery = this._getSearchQuery(query);
      queryData.query = { bool: { must: [searchQuery] } };
    }

    return await this.searchEndpoints(queryData);
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

  async searchEntities(
    query: string,
    from: number,
    size: number,
    filters: FilterModel[],
  ): Promise<ElasticEndpointSearchResponse<ElasticNodeModel>[]> {
    const queryData: any = {
      from: from,
      size: size,
      query: {
        bool: {},
      },
    };

    let searchFilters: FilterModel[] = filters;
    const isHomePageQuery = !query;
    const hasNoFiltersYet =
      !filters ||
      (filters.length === 0 && this.endpoints.enabledIds.value.length === 0);
    if (isHomePageQuery && hasNoFiltersYet) {
      searchFilters = Settings.filtersForEmptySearch as FilterModel[];
    }

    const fieldOrValueFilterQueries: (
      | ElasticSimpleQuery
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

    return await this.searchEndpoints<ElasticNodeModel>(queryData);
  }
}
