import { Component } from '@angular/core';
import { SearchService } from '../../../services/search/search.service';
import { DetailsService } from '../../../services/details.service';
import { formatNumber } from '../../../helpers/util.helper';
import { NgIf } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-search-hits-counter',
  standalone: true,
  imports: [NgIf, TranslatePipe],
  templateUrl: './search-hits-counter.component.html',
  styleUrl: './search-hits-counter.component.scss',
})
export class SearchHitsCounterComponent {
  constructor(
    public search: SearchService,
    public details: DetailsService,
    private translate: TranslateService,
  ) {}

  get numberOfHitsStr(): string {
    if (!this.search.numberOfHits) {
      return this.translate.instant('no-results-found');
    }
    if (this.search.numberOfHits === 1) {
      return this.translate.instant('1-result');
    }
    return `${formatNumber(this.search.numberOfHits)}${this.search.numberOfHitsIsCappedByElastic ? '+' : ''} ${this.translate.instant('results')}`;
  }
}
