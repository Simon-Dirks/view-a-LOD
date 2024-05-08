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

@Injectable({
  providedIn: 'root',
})
export class ElasticService {
  constructor(
    private api: ApiService,
    private data: DataService,
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
    query?: string,
    boost?: number,
  ): ElasticFieldExistsQuery {
    if (!query) {
      query = '';
    }
    return {
      exists: {
        field: query,
        boost: boost,
      },
    };
  }

  private _getMustFilterQueries(
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

  private _getMatchFilterQueries(
    filters: FilterModel[],
  ): ElasticMatchQueries[] {
    const fieldAndValueFilters = filters.filter(
      (filter) =>
        filter.type === FilterType.FieldAndValue &&
        filter.fieldId !== undefined,
    );

    let matchQueries: ElasticMatchQueries[] = [];
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
      matchQueries.push(matchQuery);
    });

    return matchQueries;
  }

  async getFilterOptions(
    filterFieldIds: string[],
    query: string,
  ): Promise<SearchResponse<any>[]> {
    const aggs = filterFieldIds.reduce((result: any, fieldId) => {
      const elasticFieldId = this.data.replacePeriodsWithSpaces(fieldId);
      result[elasticFieldId] = {
        terms: {
          field: elasticFieldId + '.keyword',
          min_doc_count: Settings.minNumOfValuesForFilterOptionToAppear,
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

  async searchEndpoints<T>(queryData: any): Promise<SearchResponse<T>[]> {
    const searchPromises = [];
    for (const endpoint of Settings.endpoints) {
      if (!endpoint.elastic) {
        continue;
      }
      const searchPromise: Promise<SearchResponse<T>> = this.api.postData<
        SearchResponse<T>
      >(endpoint.elastic, queryData);
      searchPromises.push(searchPromise);
    }
    const searchResults: SearchResponse<T>[] =
      await Promise.all(searchPromises);

    return searchResults;
  }

  async searchEntities(
    query: string,
    from: number,
    size: number,
    filters: FilterModel[],
  ): Promise<SearchResponse<ElasticNodeModel>[]> {
    const mustQueries: (ElasticSimpleQuery | ElasticFieldExistsQuery)[] =
      this._getMustFilterQueries(filters);

    if (query) {
      const searchQuery = this._getSearchQuery(query);
      mustQueries.push(searchQuery);
    }

    const filterQueries = this._getMatchFilterQueries(filters);

    const hasFilterQueries = filterQueries.length > 0;
    const queryData: any = {
      from: from,
      size: size,
      query: {
        bool: {
          must: [...mustQueries],
          should: [...filterQueries],
          minimum_should_match: hasFilterQueries ? 1 : 0,
        },
      },
    };

    return await this.searchEndpoints<ElasticNodeModel>(queryData);
  }
}
