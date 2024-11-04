import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, Subject } from 'rxjs';
import { Settings } from '../config/settings';
import { ElasticEndpointSearchResponse } from '../models/elastic/elastic-endpoint-search-response.type';
import { ElasticService } from './elastic.service';
import { DataService } from './data.service';
import { FilterModel } from '../models/filter.model';
import { FilterService } from './search/filter.service';
import { FilterOptionsIdsModel } from '../models/filter-option.model';
import { ElasticShouldQueries } from '../models/elastic/elastic-should-queries.type';
import {
  AutocompleteOptionModel,
  AutocompleteOptionType,
} from '../models/autocomplete-option.model';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  searchSubject: Subject<string> = new Subject();
  options: BehaviorSubject<AutocompleteOptionModel[]> = new BehaviorSubject<
    AutocompleteOptionModel[]
  >([]);
  isLoading = false;

  constructor(
    private elastic: ElasticService,
    private data: DataService,
    private filter: FilterService,
  ) {
    this._initDebouncedOptionsRetrieval();
  }

  hasOptionsOfType(type: AutocompleteOptionType): boolean {
    return this.getOptionsByType(type).length > 0;
  }

  getOptionsByType(type: AutocompleteOptionType): AutocompleteOptionModel[] {
    return this.options.value.filter((option) => option.type === type);
  }

  clearOptions() {
    this.options.next([]);
  }

  private _initDebouncedOptionsRetrieval() {
    this.searchSubject
      .pipe(debounceTime(300))
      .subscribe(async (input) => this._updateOptions(input));
  }

  private async _updateOptions(input: string) {
    const options = await this._getOptions(input);
    const shownOptions = options.slice(
      0,
      Settings.search.autocomplete.maxAutocompleteOptionsToShow,
    );
    this.options.next(shownOptions);
  }

  private _getOptionsFromSearchResults(
    results: ElasticEndpointSearchResponse<any>[],
  ) {
    let optionsSet: { [id: string]: Set<string> } = {};
    for (const result of results) {
      for (const hit of result.hits.hits) {
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
    return optionsSet;
  }

  private async _getOptionsFromElastic(
    query: any,
    optionType: AutocompleteOptionType,
  ): Promise<AutocompleteOptionModel[]> {
    const results: ElasticEndpointSearchResponse<any>[] =
      await this.elastic.searchEndpoints(query);

    const optionsSet = this._getOptionsFromSearchResults(results);
    const options: AutocompleteOptionModel[] = Object.keys(optionsSet)
      .map((id) => ({
        '@id': id,
        labels: Array.from(optionsSet[id]),
        type: optionType,
      }))
      .filter((option: AutocompleteOptionModel) => option.labels.length > 0);
    return options;
  }

  private async _getOptions(
    searchInput: string,
  ): Promise<AutocompleteOptionModel[]> {
    console.log('Retrieving autocomplete options...', searchInput);

    if (!searchInput) {
      return [];
    }

    this.isLoading = true;

    const filtersForSearchTermOptions: FilterModel[] =
      this.data.convertFiltersFromIdsFormat(
        Settings.search.autocomplete
          .filtersForSearchTermOptions as FilterOptionsIdsModel,
      );

    const queriesForSearchTermOptions: ElasticShouldQueries[] =
      this.elastic.getFieldAndValueFilterQueries(filtersForSearchTermOptions);

    const query: any = {
      query: {
        bool: {
          must: [
            {
              query_string: { query: `*${searchInput}*` },
            },
          ],
        },
      },
      size: Settings.search.autocomplete.maxAutocompleteOptionsPerEndpoint,
    };

    const searchTermQuery: any = JSON.parse(JSON.stringify(query));
    searchTermQuery.query.bool.should = queriesForSearchTermOptions;
    searchTermQuery.query.bool.minimum_should_match = 1;

    const nodeOptions: AutocompleteOptionModel[] =
      await this._getOptionsFromElastic(query, AutocompleteOptionType.Node);
    const searchTermOptions: AutocompleteOptionModel[] =
      await this._getOptionsFromElastic(
        searchTermQuery,
        AutocompleteOptionType.SearchTerm,
      );

    this.isLoading = false;

    const allOptions = [...searchTermOptions, ...nodeOptions];
    return allOptions;
  }
}
