import { estypes } from '@elastic/elasticsearch';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Settings } from '../config/settings';
import { ElasticNodeModel } from '../models/elastic/elastic-node.model';
import { FilterModel, FilterType } from '../models/filter.model';
import { ElasticSimpleQuery } from '../models/elastic/elastic-simple-query.type';
import { ElasticFieldExistsQuery } from '../models/elastic/elastic-field-exists-query.type';
import { DataService } from './data.service';
import { ElasticMatchQueries } from '../models/elastic/elastic-match-queries.type';

@Injectable({
  providedIn: 'root',
})
export class ElasticService {
  constructor(
    private api: ApiService,
    private data: DataService,
  ) {}

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

  private _getMustQueries(
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

  private _getMatchQueries(filters: FilterModel[]): ElasticMatchQueries[] {
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
        match: { [fieldIdWithSpaces]: filter.valueId },
      };
      matchQueries.push(matchQuery);
    });

    return matchQueries;
  }

  async searchEntities(
    query: string,
    from: number,
    size: number,
    filters: FilterModel[],
  ): Promise<estypes.SearchResponse<ElasticNodeModel>[]> {
    const mustQueries: (ElasticSimpleQuery | ElasticFieldExistsQuery)[] =
      this._getMustQueries(filters);

    const searchQuery = this._getSimpleQuery(query);
    mustQueries.push(searchQuery);

    const matchQueries = this._getMatchQueries(filters);

    const queryData: any = {
      from: from,
      size: size,
      query: {
        bool: {
          must: mustQueries,
          should: [...matchQueries],
        },
      },
    };

    const searchPromises = [];
    for (const endpoint of Settings.endpoints) {
      if (!endpoint.elastic) {
        continue;
      }
      const searchPromise = this.api.postData<
        estypes.SearchResponse<ElasticNodeModel>
      >(endpoint.elastic, queryData);
      searchPromises.push(searchPromise);
    }
    const searchResults: estypes.SearchResponse<ElasticNodeModel>[] =
      await Promise.all(searchPromises);

    return searchResults;
  }
}
