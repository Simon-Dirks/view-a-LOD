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
import { ElasticEndpointSearchResponse } from '../../models/elastic/elastic-endpoint-search-response.type';
import { ActivatedRoute } from '@angular/router';
import { DetailsService } from '../details.service';
import { SortService } from '../sort.service';
import { SortOptionModel } from '../../models/settings/sort-option.model';
import { ThingWithLabelsModel } from '../../models/thing-with-label.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  queryStr: string = '';

  results: BehaviorSubject<SearchResultsModel> =
    new BehaviorSubject<SearchResultsModel>({});
  page: number = 0;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  numberOfHits: number = 0;
  numberOfHitsIsCappedByElastic: boolean = false;

  hasDoneInitialSearch: boolean = false;
  hasMoreResultsToLoad = true;

  private _searchQueryId = 0;

  constructor(
    private elastic: ElasticService,
    private hits: SearchHitsService,
    private nodes: NodeService,
    private filters: FilterService,
    private data: DataService,
    private endpoints: EndpointService,
    private route: ActivatedRoute,
    private details: DetailsService,
    private sort: SortService,
  ) {
    this.initSearchOnQueryChange();
    this.initSearchOnFilterChange();
    this.initSearchOnSortChange();
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

    this.numberOfHitsIsCappedByElastic =
      [...responses].filter(
        (response) => (response as any).hits.total.relation === 'gte',
      ).length > 0;

    // TODO: Move 10000 max to config/settings file
    if (this.numberOfHits > 10000) {
      this.numberOfHits = 10000;
      this.numberOfHitsIsCappedByElastic = true;
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
    responses: ElasticEndpointSearchResponse<ElasticNodeModel>[],
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
    this.filters.searchTrigger.subscribe((s) => {
      void this.execute(true, s.clearFilters);
    });
    this.endpoints.enabledIds.subscribe((_) => {
      void this.execute(true);
    });
  }

  initSearchOnSortChange() {
    this.sort.current.subscribe((sortOption: SortOptionModel | undefined) => {
      void this.execute(true);
    });
  }

  initSearchOnQueryChange() {
    this.route.queryParams.subscribe((queryParams) => {
      const navigatedToDetails = this.details.isShowing();
      if (navigatedToDetails) {
        return;
      }

      const queryStr = queryParams['q'];
      const queryStrChanged = queryStr !== this.queryStr;
      if (!queryStrChanged) {
        return;
      }

      this.queryStr = queryStr;
      void this.execute(true);
    });
  }

  clearResults() {
    this.results.next({});
    this.page = 0;
    this.numberOfHits = 0;
    this.numberOfHitsIsCappedByElastic = false;
  }

  async checkHasMoreResultsToLoad() {
    const responses: ElasticEndpointSearchResponse<ElasticNodeModel>[] =
      await this.elastic.searchNodes(
        this.queryStr,
        this.page * Settings.search.resultsPerPagePerEndpoint,
        Settings.search.resultsPerPagePerEndpoint,
        this.filters.enabled.value,
      );
    const hits: SearchHit<ElasticNodeModel>[] =
      this.hits.getFromSearchResponses(responses);
    this.hasMoreResultsToLoad = hits && hits.length > 0;
  }

  async execute(clearResults = false, clearFilters = true) {
    // if (this.queryStr === '') {
    //   return;
    // }

    this._searchQueryId++;

    if (this.queryStr !== '') {
      this.hasDoneInitialSearch = true;
    }

    console.log('Searching for:', this.queryStr);
    if (clearResults) {
      this.clearResults();
    }
    if (clearFilters) {
      // Filters are cleared for "initial" search to see what filter options exist for this search term
      //  Afterward, previously existing filters are re-applied if they are still applicable for this search term
      this.filters.clearEnabled();
    }

    this.isLoading.next(true);
    try {
      const searchQueryIdOfRequest = this._searchQueryId;
      const searchPromise = this.elastic.searchNodes(
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

      // TODO: Cancel requests if we know there's a new request already (note: cancelling promises not easily supported at the moment)
      const responsesAreOutdated =
        this._searchQueryId !== searchQueryIdOfRequest;
      if (responsesAreOutdated) {
        return;
      }
      this._updateNumberOfHitsFromSearchResponses(responses);
      await this._updateResultsFromSearchResponses(responses);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      this.isLoading.next(false);

      void this.checkHasMoreResultsToLoad();
    }
  }

  async getAutocompleteOptions(
    searchInput: string,
  ): Promise<ThingWithLabelsModel[]> {
    console.log('Retrieving autocomplete options...', searchInput);
    const results: ElasticEndpointSearchResponse<any>[] =
      await this.elastic.searchEndpoints({
        query: {
          simple_query_string: {
            query: searchInput,
          },
        },
        size: Settings.search.autocomplete.maxAutocompleteOptionsPerEndpoint,
      });
    if (!results || results.length === 0) {
      return [];
    }

    let optionsSet: { [id: string]: Set<string> } = {};
    for (const result of results) {
      for (const hit of result.hits.hits) {
        // TODO: Refactor into function for readability
        const hitNode = hit._source;
        const id = hitNode['@id'] as string;

        if (!(id in optionsSet)) {
          optionsSet[id] = new Set();
        }

        Settings.predicates.label.forEach((predicate) => {
          const elasticLabelPredicate =
            this.data.replacePeriodsWithSpaces(predicate);
          if (elasticLabelPredicate in hitNode) {
            const hitLabels = hitNode[elasticLabelPredicate] as string[];
            for (const hitLabel of hitLabels) {
              optionsSet[id].add(hitLabel);
            }
          }
        });
      }
    }

    const options: ThingWithLabelsModel[] = Object.keys(optionsSet)
      .map((id) => ({
        '@id': id,
        labels: Array.from(optionsSet[id]),
      }))
      .filter((o) => o.labels.length > 0);

    return options;
  }
}
