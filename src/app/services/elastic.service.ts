import { estypes } from '@elastic/elasticsearch';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Settings } from '../config/settings';
import { ElasticNodeModel } from '../models/elastic/elastic-node.model';
import { FilterModel, FilterType } from '../models/filter.model';
import { ElasticSimpleQuery } from '../models/elastic/elastic-simple-query.type';
import { ElasticFieldExistsQuery } from '../models/elastic/elastic-field-exists-query.type';

@Injectable({
  providedIn: 'root',
})
export class ElasticService {
  constructor(private api: ApiService) {}

  private _getSimpleQuery(query: string, boost?: number): ElasticSimpleQuery {
    return {
      simple_query_string: {
        query: query,
        boost: boost,
      },
    };
  }

  private _getFieldExistsQuery(
    query: string,
    boost?: number,
  ): ElasticFieldExistsQuery {
    return {
      exists: {
        field: query,
        boost: boost,
      },
    };
  }

  async searchEntities(
    query: string,
    from: number,
    size: number,
    filters: FilterModel[],
  ): Promise<estypes.SearchResponse<ElasticNodeModel>[]> {
    const shouldQueries: (ElasticSimpleQuery | ElasticFieldExistsQuery)[] =
      filters.map((filter) => {
        if (filter.type === FilterType.Field) {
          return this._getFieldExistsQuery(filter.id);
        }
        return this._getSimpleQuery(filter.id);
      });

    // shouldQueries.push(this._getSimpleQuery(query));

    const queryData: any = {
      from: from,
      size: size,
      query: {
        bool: {
          must: [this._getSimpleQuery(`\"${query}\"`)],
          should: shouldQueries,
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
