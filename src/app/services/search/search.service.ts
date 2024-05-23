import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { SearchResultsModel } from '../../models/elastic/search-results.model';
import { ElasticService } from '../elastic.service';
import { NodeModel } from '../../models/node.model';
import { Settings } from '../../config/settings';
import { SearchHitsService } from './search-hits.service';
import { ElasticNodeModel } from '../../models/elastic/elastic-node.model';
import { NodeService } from '../node.service';
import { FilterService } from './filter.service';
import {
  SearchHit,
  SearchResponse,
} from '@elastic/elasticsearch/lib/api/types';
import { DataService } from '../data.service';
import { EndpointService } from '../endpoint.service';

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
    private data: DataService,
    private endpoints: EndpointService,
  ) {
    this.initSearchOnFilterChange();
    void this.execute(true);
  }

  private _updateNumberOfHitsFromSearchResponses(
    responses: SearchResponse<ElasticNodeModel>[],
  ) {
    // TODO: Save number of hits, page, morehitsavailable, etc in results variable?
    this.numberOfHits = [...responses].reduce(
      (acc, curr) => acc + (curr as any).hits.total.value,
      0,
    );

    this.moreHitsAreAvailable =
      [...responses].filter(
        (response) => (response as any).hits.total.relation === 'gte',
      ).length > 0;

    // TODO: Move 10000 max to config/settings file
    if (this.numberOfHits > 10000) {
      this.numberOfHits = 10000;
      this.moreHitsAreAvailable = true;
    }
  }

  private _mergeNodesById(
    nodes: NodeModel[],
    otherNodes: NodeModel[],
  ): NodeModel[] {
    const nodesMap = new Map<string, any>();
    nodes.forEach((node) => {
      nodesMap.set(node['@id'][0].value, node);
    });

    otherNodes.forEach((otherNode) => {
      const id = otherNode['@id'][0].value;
      if (nodesMap.has(id)) {
        Object.assign(nodesMap.get(id), otherNode);
      } else {
        nodes.push(otherNode);
      }
    });

    return nodes;
  }

  private async _updateResultsFromSearchResponses(
    responses: SearchResponse<ElasticNodeModel>[],
  ) {
    const hits: SearchHit<ElasticNodeModel>[] =
      this.hits.getFromSearchResponses(responses);

    const hitNodes: NodeModel[] = this.hits.parseToNodes(hits);
    // TODO: Run async, show initial hits in the meanwhile
    const enrichedNodes =
      await this.nodes.enrichWithIncomingRelations(hitNodes);

    const hasHits = enrichedNodes && enrichedNodes.length > 0;
    if (hasHits) {
      this.page++;
    }

    this.results.next({
      nodes: this._mergeNodesById(
        this.results.value.nodes ?? [],
        enrichedNodes,
      ),
    });
  }

  initSearchOnFilterChange() {
    this.filters.enabled.subscribe((_) => {
      void this.execute(true);
    });
    this.endpoints.enabledIds.subscribe((_) => {
      void this.execute(true, true);
    });
  }

  clearResults() {
    this.results.next({});
    this.page = 0;
    this.numberOfHits = 0;
    this.moreHitsAreAvailable = false;
  }

  async execute(clearResults = false, clearFilters = false) {
    if (clearResults) {
      this.clearResults();
    }
    if (clearFilters) {
      this.filters.enabled.next([]);
    }

    this.isLoading.next(true);
    try {
      const searchPromise = this.elastic.searchEntities(
        this.queryStr,
        this.page * Settings.search.resultsPerPagePerEndpoint,
        Settings.search.resultsPerPagePerEndpoint,
        this.filters.enabled.value,
      );
      const filterOptionsPromise = this.filters.updateFilterOptionValues(
        this.queryStr,
      );
      const [responses, _] = await Promise.all([
        searchPromise,
        filterOptionsPromise,
      ]);

      this._updateNumberOfHitsFromSearchResponses(responses);
      await this._updateResultsFromSearchResponses(responses);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      this.isLoading.next(false);
    }
  }
}
