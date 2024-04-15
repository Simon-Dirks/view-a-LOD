import { estypes } from '@elastic/elasticsearch';
import { Injectable } from '@angular/core';
import { ElasticQueryModel } from '../models/elastic-query.model';
import { ApiService } from './api.service';
import { Settings } from '../config/settings';
import { NodeModel } from '../models/node.model';

@Injectable({
  providedIn: 'root',
})
export class ElasticService {
  constructor(private api: ApiService) {}

  async searchEntities(
    query: string,
    from: number,
    size: number,
  ): Promise<estypes.SearchResponse<NodeModel>> {
    const queryData: ElasticQueryModel = {
      from: from,
      size: size,
      query: {
        simple_query_string: {
          query: query,
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
    return await this.api.postData<estypes.SearchResponse<NodeModel>>(
      Settings.endpoints.elastic,
      queryData,
    );
  }
}
