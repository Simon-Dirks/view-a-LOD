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

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, NgIcon, NgIf, NgClass, JsonPipe, NgForOf, RouterLink],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnInit {
  searchInput: string = this.search.queryStr;
  autocompleteOptions: ThingWithLabelsModel[] = [];

  constructor(
    public search: SearchService,
    public router: Router,
    public elastic: ElasticService,
    public details: DetailsService,
  ) {}

  ngOnInit() {}

  protected readonly Settings = Settings;
  protected readonly featherSearch = featherSearch;

  async onSearch() {
    // if (!this.searchInput) {
    //   return;
    // }

    const queryParams: NavigationExtras = {
      queryParams: { q: this.searchInput },
    };

    await this.router.navigate(['search'], queryParams);
  }

  async onSearchInputChange() {
    // TODO: Add debounce
    const options = await this.search.getAutocompleteOptions(this.searchInput);
    this.autocompleteOptions = options.slice(
      0,
      Settings.search.maxAutocompleteOptionsToShow,
    );
  }

  async onAutocompleteSelect(id: string) {
    this.autocompleteOptions = [];
    await this.onSearch();
    await this.router.navigateByUrl(this.details.getLinkFromUrl(id));
  }
}
