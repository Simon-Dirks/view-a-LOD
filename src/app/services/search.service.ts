import { Injectable } from '@angular/core';
import { estypes } from '@elastic/elasticsearch';
import { NodeModel } from '../models/node.model';
import { ElasticService } from './elastic.service';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';
import { Settings } from '../config/settings';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  queryStr: string = 'Margaretha';
  results: BehaviorSubject<NodeModel[]> = new BehaviorSubject<NodeModel[]>([]);
  page: number = 0;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private elastic: ElasticService,
    private data: DataService,
  ) {}

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
    this.page = 0;
  }

  async execute(clearResults = false) {
    console.log('SEARCHING...');
    if (clearResults) {
      this.clearResults();
    }

    this.isLoading.next(true);
    try {
      const response: estypes.SearchResponse<NodeModel> =
        await this.elastic.searchEntities(
          this.queryStr,
          this.page * Settings.search.resultsPerPage,
        );
      const hits: estypes.SearchHit<NodeModel>[] = response?.hits?.hits;
      const hitNodes: NodeModel[] = this._parseHitsToNodes(hits);
      const hasHits = hitNodes && hitNodes.length > 0;
      if (hasHits) {
        this.page++;
      }
      this.results.next([...this.results.value, ...hitNodes]);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      this.isLoading.next(false);
    }
  }
}
