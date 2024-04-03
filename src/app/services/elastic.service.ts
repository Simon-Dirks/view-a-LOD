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
    query: string
  ): Promise<estypes.SearchResponse<NodeModel>> {
    const queryData: ElasticQueryModel = {
      query: {
        simple_query_string: {
          query: query,
        },
      },
    };
    return await this.api.postData<estypes.SearchResponse<NodeModel>>(
      Settings.endpoints.elastic,
      queryData
    );
  }
}
