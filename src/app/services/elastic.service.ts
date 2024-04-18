import { estypes } from '@elastic/elasticsearch';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Settings } from '../config/settings';
import { NodeModel } from '../models/node.model';
import { ElasticFiltersModel } from '../models/elastic-filters.model';

@Injectable({
  providedIn: 'root',
})
export class ElasticService {
  constructor(private api: ApiService) {}

  async searchEntities(
    query: string,
    filters: ElasticFiltersModel,
    from: number,
    size: number,
  ): Promise<estypes.SearchResponse<NodeModel>[]> {
    const queryData: any = {
      from: from,
      size: size,
      query: {
        bool: {
          must: [
            {
              simple_query_string: {
                query: query,
              },
            },
          ],
        },
      },
      aggs: {
        rdf_types: {
          terms: {
            field: 'http://www w3 org/1999/02/22-rdf-syntax-ns#type.keyword',
          },
        },
      },
    };

    const hasFilters = Object.keys(filters.terms).length > 0;
    if (hasFilters) {
      queryData.query.bool.must.push(filters);
      console.log(queryData);
    }

    const searchPromises = [];
    for (const endpoint of Settings.endpoints) {
      const searchPromise = this.api.postData<
        estypes.SearchResponse<NodeModel>
      >(endpoint.elastic, queryData);
      searchPromises.push(searchPromise);
    }
    const searchResults: estypes.SearchResponse<NodeModel>[] =
      await Promise.all(searchPromises);

    return searchResults;
  }
}
