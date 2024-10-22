import { Component } from '@angular/core';
import { SearchService } from '../../../services/search/search.service';
import { DetailsService } from '../../../services/details.service';
import { formatNumber } from '../../../helpers/util.helper';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-search-hits-counter',
  standalone: true,
  imports: [NgIf],
  templateUrl: './search-hits-counter.component.html',
  styleUrl: './search-hits-counter.component.scss',
})
export class SearchHitsCounterComponent {
  constructor(
    public search: SearchService,
    public details: DetailsService,
  ) {}

  get numberOfHitsStr(): string {
    if (!this.search.numberOfHits) {
      return 'Geen resultaten gevonden';
    }
    if (this.search.numberOfHits === 1) {
      return '1 resultaat';
    }
    return `${formatNumber(this.search.numberOfHits)}${this.search.numberOfHitsIsCappedByElastic ? '+' : ''} resultaten`;
  }
}
