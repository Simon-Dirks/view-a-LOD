import { Injectable } from '@angular/core';
import { estypes } from '@elastic/elasticsearch';
import { Direction, NodeModel } from '../../models/node.model';
import { DataService } from '../data.service';
import { ElasticNodeModel } from '../../models/elastic/elastic-node.model';

@Injectable({
  providedIn: 'root',
})
export class SearchHitsService {
  constructor(private data: DataService) {}

  parseToNodes(hits: estypes.SearchHit<ElasticNodeModel>[]): NodeModel[] {
    return hits
      .sort((a, b) => {
        return (a._source as any)?.['_score'] - (b._source as any)?.['_score'];
      })
      .map((hit) => hit?._source)
      .filter((hitNode): hitNode is ElasticNodeModel => !!hitNode)
      .map((hitNode) => {
        const node: NodeModel = {
          '@id': [],
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
    searchResponses: estypes.SearchResponse<ElasticNodeModel>[],
  ): estypes.SearchHit<ElasticNodeModel>[] {
    const mergedHits: estypes.SearchHit<ElasticNodeModel>[] =
      searchResponses.flatMap((searchResponse) => {
        return searchResponse?.hits?.hits ?? [];
      });

    return mergedHits;
  }
}
