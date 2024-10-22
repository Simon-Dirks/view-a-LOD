import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { SearchService } from '../../services/search/search.service';
import { Settings } from '../../config/settings';
import { Router, RouterLink } from '@angular/router';
import { ElasticService } from '../../services/elastic.service';
import { DetailsService } from '../../services/details.service';
import { AutocompleteService } from '../../services/autocomplete.service';
import { UrlService } from '../../services/url.service';
import { Config } from '../../config/config';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, NgIcon, NgIf, NgClass, JsonPipe, NgForOf, RouterLink],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnInit, AfterViewInit {
  searchInput: string = this.search.queryStr;

  constructor(
    public search: SearchService,
    public router: Router,
    public elastic: ElasticService,
    public details: DetailsService,
    public autocomplete: AutocompleteService,
    public url: UrlService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {}

  get hasAutocompleteOptions(): boolean {
    return this.autocomplete.options.value.length > 0;
  }

  async onSearch() {
    // if (!this.searchInput) {
    //   return;
    // }

    this.autocomplete.clearOptions();

    await this.router.navigate([], {
      queryParams: { [Config.searchParam]: this.searchInput },
      queryParamsHandling: 'merge',
    });
  }

  async onSearchInputChange() {
    if (!Settings.search.autocomplete.enabled) {
      return;
    }

    this.autocomplete.searchSubject.next(this.searchInput);
  }

  async onAutocompleteOptionSelect(id: string) {
    await this.onSearch();
    await this.router.navigateByUrl(this.details.getLinkFromUrl(id));
  }

  protected readonly Settings = Settings;
}
