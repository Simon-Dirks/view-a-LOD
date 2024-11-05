import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { SearchService } from '../../../services/search/search.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-load-more-search-results-button',
  standalone: true,
  imports: [NgIf, TranslatePipe],
  templateUrl: './load-more-search-results-button.component.html',
  styleUrl: './load-more-search-results-button.component.scss',
})
export class LoadMoreSearchResultsButtonComponent {
  constructor(public search: SearchService) {}

  loadMore() {
    if (!this.search.isLoading.value) {
      void this.search.execute(false, false);
    }
  }
}
