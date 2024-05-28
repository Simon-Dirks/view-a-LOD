import { Injectable } from '@angular/core';
import { Direction, NodeModel } from '../../models/node.model';
import { DataService } from '../data.service';
import { ElasticNodeModel } from '../../models/elastic/elastic-node.model';
import { SearchHit } from '@elastic/elasticsearch/lib/api/types';
import { ElasticEndpointSearchResponse } from '../../models/elastic/elastic-endpoint-search-response.type';

@Injectable({
  providedIn: 'root',
})
export class SearchHitsService {
  constructor(private data: DataService) {}

  parseToNodes(hits: SearchHit<ElasticNodeModel>[]): NodeModel[] {
    return hits
      .sort((a, b) => {
        return (a._source as any)?.['_score'] - (b._source as any)?.['_score'];
      })
      .map((hit) => hit?._source)
      .filter((hitNode): hitNode is ElasticNodeModel => !!hitNode)
      .map((hitNode) => {
        const node: NodeModel = {
          '@id': [],
          endpointId: [],
        };
        this.data.replaceElasticNodePredSpacesWithPeriods(hitNode);
        for (const [pred, obj] of Object.entries(hitNode)) {
          if (!(pred in node)) {
            node[pred] = [];
          }
          const objValuesAsArray = Array.isArray(obj) ? obj : [obj];
          for (const objValue of objValuesAsArray) {
            node[pred].push({ value: objValue, direction: Direction.Outgoing });
          }
        }
        return node;
      });
  }

  getFromSearchResponses(
    searchResponses: ElasticEndpointSearchResponse<ElasticNodeModel>[],
  ): SearchHit<ElasticNodeModel>[] {
    const mergedHits: SearchHit<ElasticNodeModel>[] = searchResponses.flatMap(
      (searchResponse) => {
        const hits = searchResponse?.hits?.hits ?? [];
        hits.forEach(
          (hit) =>
            ((hit._source as any)['endpointId'] = searchResponse.endpointId),
        );
        return hits;
      },
    );

    return mergedHits;
  }
}
