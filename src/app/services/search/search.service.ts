import { Injectable } from '@angular/core';
import { estypes } from '@elastic/elasticsearch';

import { BehaviorSubject } from 'rxjs';
import { SearchResultsModel } from '../../models/elastic/search-results.model';
import { ElasticService } from '../elastic.service';
import { NodeModel } from '../../models/node.model';
import { Settings } from '../../config/settings';
import { SearchHitsService } from './search-hits.service';
import { ElasticNodeModel } from '../../models/elastic/elastic-node.model';
import { NodeService } from '../node.service';
import { FilterService } from './filter.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  queryStr: string = Settings.defaultSearchQuery;

  results: BehaviorSubject<SearchResultsModel> =
    new BehaviorSubject<SearchResultsModel>({});
  page: number = 0;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  numberOfHits: number = 0;
  moreHitsAreAvailable: boolean = false;

  constructor(
    private elastic: ElasticService,
    private hits: SearchHitsService,
    private nodes: NodeService,
    private filters: FilterService,
  ) {
    this.initSearchOnFilterChange();
  }

  initSearchOnFilterChange() {
    this.filters.enabled.subscribe((f) => {
      void this.execute(true);
    });
  }

  clearResults() {
    this.results.next({});
    this.page = 0;
    this.numberOfHits = 0;
    this.moreHitsAreAvailable = false;
  }

  async execute(clearResults = false) {
    if (clearResults) {
      this.clearResults();
    }

    this.isLoading.next(true);
    try {
      const responses: estypes.SearchResponse<ElasticNodeModel>[] =
        await this.elastic.searchEntities(
          this.queryStr,
          this.page * Settings.search.resultsPerPagePerEndpoint,
          Settings.search.resultsPerPagePerEndpoint,
          this.filters.enabled.value,
        );
      this.numberOfHits = [...responses].reduce(
        (acc, curr) => acc + (curr as any).hits.total.value,
        0,
      );
      this.moreHitsAreAvailable =
        [...responses].filter(
          (response) => (response as any).hits.total.relation === 'gte',
        ).length > 0;

      const hits: estypes.SearchHit<ElasticNodeModel>[] =
        this.hits.getFromSearchResponses(responses);

      const hitNodes: NodeModel[] = this.hits.parseToNodes(hits);
      void this.nodes.enrichWithIncomingRelations(hitNodes);
      const hasHits = hitNodes && hitNodes.length > 0;
      if (hasHits) {
        this.page++;
      }
      this.results.next({
        nodes: [...(this.results.value.nodes ?? []), ...hitNodes],
      });
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      this.isLoading.next(false);
    }
  }
}
