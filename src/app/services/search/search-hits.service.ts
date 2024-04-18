import { Injectable } from '@angular/core';
import { estypes } from '@elastic/elasticsearch';
import { NodeModel } from '../../models/node.model';
import { DataService } from '../data.service';

@Injectable({
  providedIn: 'root',
})
export class SearchHitsService {
  constructor(private data: DataService) {}

  parseToNodes(hits: estypes.SearchHit<NodeModel>[]): NodeModel[] {
    return hits
      .map((hit) => hit?._source)
      .filter((hitNode): hitNode is NodeModel => !!hitNode)
      .map((hitNode) => {
        this.data.replaceNodePredSpacesWithPeriods(hitNode);
        return hitNode;
      });
  }

  getFromSearchResponses(
    searchResponses: estypes.SearchResponse<NodeModel>[],
  ): estypes.SearchHit<NodeModel>[] {
    const mergedHits: estypes.SearchHit<NodeModel>[] = searchResponses.flatMap(
      (searchResponse) => {
        return searchResponse?.hits?.hits ?? [];
      },
    );

    return mergedHits;
  }
}
