import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { SearchService } from '../../services/search/search.service';
import { Settings } from '../../config/settings';
import { NavigationExtras, Router, RouterLink } from '@angular/router';
import { ElasticService } from '../../services/elastic.service';
import { DetailsService } from '../../services/details.service';
import { AutocompleteService } from '../../services/autocomplete.service';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, NgIcon, NgIf, NgClass, JsonPipe, NgForOf, RouterLink],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnInit {
  searchInput: string = this.search.queryStr;

  constructor(
    public search: SearchService,
    public router: Router,
    public elastic: ElasticService,
    public details: DetailsService,
    public autocomplete: AutocompleteService,
  ) {}

  ngOnInit() {}

  get hasAutocompleteOptions(): boolean {
    return this.autocomplete.options.length > 0;
  }

  async onSearch() {
    // if (!this.searchInput) {
    //   return;
    // }

    this.autocomplete.options = [];

    const queryParams: NavigationExtras = {
      queryParams: { q: this.searchInput },
    };

    await this.router.navigate(['search'], queryParams);
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
