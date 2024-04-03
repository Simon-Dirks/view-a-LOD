import { Injectable } from '@angular/core';
import { estypes } from '@elastic/elasticsearch';
import { NodeModel } from '../models/node.model';
import { ElasticService } from './elastic.service';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  results: BehaviorSubject<NodeModel[]> = new BehaviorSubject<NodeModel[]>([]);

  constructor(private elastic: ElasticService, private data: DataService) {}

  private _parseHitsToNodes(hits: estypes.SearchHit<NodeModel>[]): NodeModel[] {
    return hits
      .map((hit) => hit?._source)
      .filter((hitNode): hitNode is NodeModel => !!hitNode)
      .map((hitNode) => {
        this.data.replaceNodePredSpacesWithPeriods(hitNode);
        return hitNode;
      });
  }

  clearResults() {
    this.results.next([]);
  }

  async execute(query: string) {
    this.clearResults();

    try {
      const response: estypes.SearchResponse<NodeModel> =
        await this.elastic.searchEntities(query);
      const hits: estypes.SearchHit<NodeModel>[] = response?.hits?.hits;
      const hitNodes: NodeModel[] = this._parseHitsToNodes(hits);
      this.results.next([...this.results.value, ...hitNodes]);
    } catch (error) {
      console.error('Error searching:', error);
    }
  }
}
