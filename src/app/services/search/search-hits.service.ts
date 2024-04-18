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
      .map((hit) => hit?._source)
      .filter((hitNode): hitNode is ElasticNodeModel => !!hitNode)
      .map((hitNode) => {
        const node: NodeModel = { '@id': { value: hitNode['@id'] } };
        this.data.replaceElasticNodePredSpacesWithPeriods(hitNode);
        for (const [pred, obj] of Object.entries(hitNode)) {
          node[pred] = { value: obj, direction: Direction.Outgoing };
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
