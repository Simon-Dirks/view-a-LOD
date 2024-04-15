import { Component, OnInit } from '@angular/core';
import { ListNodeComponent } from '../../list-node/list-node.component';
import { JsonPipe, NgForOf } from '@angular/common';
import { SearchService } from '../../../services/search.service';
import { SearchInputComponent } from '../../search-input/search-input.component';
import { TypeCountsComponent } from '../../type-counts/type-counts.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ListNodeComponent,
    NgForOf,
    SearchInputComponent,
    JsonPipe,
    TypeCountsComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  constructor(public search: SearchService) {}

  ngOnInit() {}

  onScroll($event: any) {
    const hasReachedEnd =
      $event.target.offsetHeight + $event.target.scrollTop >=
      $event.target.scrollHeight;
    if (hasReachedEnd) {
      void this.search.execute();
    }
  }
}
