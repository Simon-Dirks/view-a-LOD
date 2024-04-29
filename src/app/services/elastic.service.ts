import { estypes } from '@elastic/elasticsearch';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Settings } from '../config/settings';
import { ElasticNodeModel } from '../models/elastic/elastic-node.model';

@Injectable({
  providedIn: 'root',
})
export class ElasticService {
  constructor(private api: ApiService) {}

  async searchEntities(
    query: string,
    from: number,
    size: number,
  ): Promise<estypes.SearchResponse<ElasticNodeModel>[]> {
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
