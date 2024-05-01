import { estypes } from '@elastic/elasticsearch';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Settings } from '../config/settings';
import { ElasticNodeModel } from '../models/elastic/elastic-node.model';
import { FilterModel } from '../models/filter.model';
import { ElasticSimpleQuery } from '../models/elastic/elastic-simple-query.type';

@Injectable({
  providedIn: 'root',
})
export class ElasticService {
  constructor(private api: ApiService) {}

  private _getSimpleQuery(query: string): ElasticSimpleQuery {
    return {
      simple_query_string: {
        query: query,
      },
    };
  }

  async searchEntities(
    query: string,
    from: number,
    size: number,
    filters: FilterModel[],
  ): Promise<estypes.SearchResponse<ElasticNodeModel>[]> {
    const shouldQueries: ElasticSimpleQuery[] = filters.map((filter) => {
      return this._getSimpleQuery(filter.id);
    });

    // shouldQueries.push(this._getSimpleQuery(query));

    const queryData: any = {
      from: from,
      size: size,
      query: {
        bool: {
          must: [this._getSimpleQuery(query)],
          should: shouldQueries,
        },
      },
    };

    const searchPromises = [];
    for (const endpoint of Settings.endpoints) {
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
