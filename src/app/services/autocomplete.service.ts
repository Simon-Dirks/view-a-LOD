import { Injectable } from '@angular/core';
import { BehaviorSubject, debounceTime, Subject } from 'rxjs';
import { ThingWithLabelsModel } from '../models/thing-with-label.model';
import { Settings } from '../config/settings';
import { ElasticEndpointSearchResponse } from '../models/elastic/elastic-endpoint-search-response.type';
import { ElasticService } from './elastic.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  searchSubject: Subject<string> = new Subject();
  options: BehaviorSubject<ThingWithLabelsModel[]> = new BehaviorSubject<
    ThingWithLabelsModel[]
  >([]);
  isLoading = false;

  constructor(
    private elastic: ElasticService,
    private data: DataService,
  ) {
    this._initDebouncedOptionsRetrieval();
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

  private async _getOptions(
    searchInput: string,
  ): Promise<ThingWithLabelsModel[]> {
    console.log('Retrieving autocomplete options...', searchInput);
    this.isLoading = true;

    const results: ElasticEndpointSearchResponse<any>[] =
      await this.elastic.searchEndpoints({
        query: {
          simple_query_string: {
            query: searchInput,
          },
        },
        size: Settings.search.autocomplete.maxAutocompleteOptionsPerEndpoint,
      });

    this.isLoading = false;
    if (!results || results.length === 0) {
      return [];
    }

    const optionsSet = this._getOptionsFromSearchResults(results);
    const options: ThingWithLabelsModel[] = Object.keys(optionsSet)
      .map((id) => ({
        '@id': id,
        labels: Array.from(optionsSet[id]),
      }))
      .filter((o) => o.labels.length > 0);

    return options;
  }
}
