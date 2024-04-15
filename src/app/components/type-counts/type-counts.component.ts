import { Component, Input } from '@angular/core';
import {
  TypeCountModel,
  TypeCountsModel,
} from '../../models/search-results.model';
import {
  AsyncPipe,
  JsonPipe,
  KeyValuePipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import { CacheService } from '../../services/cache.service';
import { NodeLinkComponent } from '../list-node/node-link/node-link.component';

@Component({
  selector: 'app-type-counts',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    KeyValuePipe,
    NgForOf,
    AsyncPipe,
    NodeLinkComponent,
  ],
  templateUrl: './type-counts.component.html',
  styleUrl: './type-counts.component.scss',
})
export class TypeCountsComponent {
  @Input() typeCounts?: TypeCountsModel;

  public get typeCountsList(): TypeCountModel[] {
    if (!this.typeCounts) {
      return [];
    }

    const list: TypeCountModel[] = Object.values(this.typeCounts);
    list.map((t) => this.cache.cacheLabelForId(t.typeDetails['@id']));
    return list;
  }
  constructor(public cache: CacheService) {}
}
