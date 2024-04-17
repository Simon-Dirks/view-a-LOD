import { Injectable } from '@angular/core';
import { estypes } from '@elastic/elasticsearch';
import { NodeModel } from '../models/node.model';
import { ElasticService } from './elastic.service';
import { BehaviorSubject } from 'rxjs';
import { DataService } from './data.service';
import { Settings } from '../config/settings';
import {
  SearchResultsModel,
  TypeCountsModel,
} from '../models/search-results.model';
import { replacePrefixes } from '../helpers/util.helper';
import {
  ElasticFiltersModel,
  NoElasticFilters,
} from '../models/elastic-filters.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  queryStr: string = 'Margaretha';
  filters: BehaviorSubject<ElasticFiltersModel> =
    new BehaviorSubject<ElasticFiltersModel>(NoElasticFilters);

  results: BehaviorSubject<SearchResultsModel> =
    new BehaviorSubject<SearchResultsModel>({});
  page: number = 0;
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private elastic: ElasticService,
    private data: DataService,
  ) {
    this._initSearchOnFilterChange();
  }

  private _initSearchOnFilterChange() {
    this.filters.subscribe((filters) => {
      console.log('FILTER CHANGE', filters);
      void this.execute(true);
    });
  }

  private _parseHitsToNodes(hits: estypes.SearchHit<NodeModel>[]): NodeModel[] {
    return hits
      .map((hit) => hit?._source)
      .filter((hitNode): hitNode is NodeModel => !!hitNode)
      .map((hitNode) => {
        this.data.replaceNodePredSpacesWithPeriods(hitNode);
        return hitNode;
      });
  }

  private _parseTypeCounts(
    searchResponse: estypes.SearchResponse<NodeModel>,
  ): TypeCountsModel {
    const aggregations: any = searchResponse?.aggregations;
    const buckets: { key: string; doc_count: string }[] =
      aggregations?.['rdf_types']?.buckets;
    const typeCounts: TypeCountsModel = {};
    buckets.forEach((bucket) => {
      const typeId = bucket.key;
      const typeLabel = typeId;
      typeCounts[typeId] = {
        typeDetails: {
          label: replacePrefixes(typeId),
          '@id': typeId,
        },
        count: Number(bucket.doc_count),
      };
    });
    return typeCounts;
  }

  hasFilter(filterId: string, filterValue: string) {
    return this.filters.value.terms?.[filterId]?.includes(filterValue);
  }

  toggleFilter(filterId: string, filterValue: string) {
    const currentFilterValues: string[] =
      this.filters.value.terms?.[filterId] || [];
    const updatedFilterSet: Set<string> = new Set(currentFilterValues);
    if (updatedFilterSet.has(filterValue)) {
      updatedFilterSet.delete(filterValue);
    } else {
      updatedFilterSet.add(filterValue);
    }

    const hasFilters = updatedFilterSet.size > 0;
    const updatedFilters = { ...this.filters.value };
    if (hasFilters) {
      updatedFilters.terms[filterId] = Array.from(updatedFilterSet);
    } else {
      delete updatedFilters.terms[filterId];
    }
    this.filters.next(updatedFilters);
    console.log('FILTERS', updatedFilters);
  }

  clearResults() {
    this.results.next({});
    this.page = 0;
  }

  clearFilters() {
    this.filters.next({ terms: {} });
  }

  async execute(clearResults = false) {
    if (clearResults) {
      this.clearResults();
    }

    this.isLoading.next(true);
    try {
      const response: estypes.SearchResponse<NodeModel> =
        await this.elastic.searchEntities(
          this.queryStr,
          this.filters.value,
          this.page * Settings.search.resultsPerPage,
          Settings.search.resultsPerPage,
        );
      const typeCounts: TypeCountsModel = this._parseTypeCounts(response);

      const hits: estypes.SearchHit<NodeModel>[] = response?.hits?.hits;
      const hitNodes: NodeModel[] = this._parseHitsToNodes(hits);
      const hasHits = hitNodes && hitNodes.length > 0;
      if (hasHits) {
        this.page++;
      }
      this.results.next({
        nodes: [...(this.results.value.nodes ?? []), ...hitNodes],
        typeCounts: typeCounts,
      });
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      this.isLoading.next(false);
    }
  }
}
