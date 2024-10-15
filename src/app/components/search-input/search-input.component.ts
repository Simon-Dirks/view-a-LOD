import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { SearchService } from '../../services/search/search.service';
import { Settings } from '../../config/settings';
import { featherSearch } from '@ng-icons/feather-icons';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
import { ElasticService } from '../../services/elastic.service';
import { ThingWithLabelsModel } from '../../models/thing-with-label.model';
import { DetailsService } from '../../services/details.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, NgIcon, NgIf, NgClass, JsonPipe, NgForOf, RouterLink],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnInit {
  searchInput: string = this.search.queryStr;

  private _autocompleteSearchSubject: Subject<string> = new Subject();
  autocompleteOptions: ThingWithLabelsModel[] = [];

  constructor(
    public search: SearchService,
    public router: Router,
    public elastic: ElasticService,
    public details: DetailsService,
  ) {}

  ngOnInit() {
    this._initDebouncedAutocompleteOptionsRetrieval();
  }

  protected readonly Settings = Settings;
  protected readonly featherSearch = featherSearch;

  async onSearch() {
    // if (!this.searchInput) {
    //   return;
    // }

    this.autocompleteOptions = [];

    const queryParams: NavigationExtras = {
      queryParams: { q: this.searchInput },
    };

    await this.router.navigate(['search'], queryParams);
  }

  private _initDebouncedAutocompleteOptionsRetrieval() {
    this._autocompleteSearchSubject
      .pipe(debounceTime(300))
      .subscribe(async (input) => this._updateAutocompleteOptions(input));
  }

  private async _updateAutocompleteOptions(input: string) {
    const options = await this.search.getAutocompleteOptions(input);
    this.autocompleteOptions = options.slice(
      0,
      Settings.search.autocomplete.maxAutocompleteOptionsToShow,
    );
  }

  async onSearchInputChange() {
    if (!Settings.search.autocomplete.enabled) {
      return;
    }

    this._autocompleteSearchSubject.next(this.searchInput);
  }

  async onAutocompleteOptionSelect(id: string) {
    await this.onSearch();
    await this.router.navigateByUrl(this.details.getLinkFromUrl(id));
  }
}
