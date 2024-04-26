import { Component, Input } from '@angular/core';
import {
  TypeCountModel,
  TypeCountsModel,
} from '../../models/search-results.model';
import {
  AsyncPipe,
  JsonPipe,
  KeyValuePipe,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import { CacheService } from '../../services/cache.service';
import { NodeLinkComponent } from '../node/node-link/node-link.component';
import { SearchService } from '../../services/search/search.service';

@Component({
  selector: 'app-type-filter',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    KeyValuePipe,
    NgForOf,
    AsyncPipe,
    NodeLinkComponent,
    NgClass,
  ],
  templateUrl: './type-filter.component.html',
  styleUrl: './type-filter.component.scss',
})
export class TypeFilterComponent {
  @Input() typeCounts?: TypeCountsModel;

  public get typeCountsList(): TypeCountModel[] {
    if (!this.typeCounts) {
      return [];
    }

    const list: TypeCountModel[] = Object.values(this.typeCounts);
    list.map((t) => this.cache.cacheLabelForId(t.typeDetails['@id']));
    return list;
  }
  constructor(
    public cache: CacheService,
    public search: SearchService,
  ) {}
}
