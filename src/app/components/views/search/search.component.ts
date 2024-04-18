import { Component, OnInit } from '@angular/core';
import { ListNodeComponent } from '../../list-node/list-node.component';
import { JsonPipe, NgForOf } from '@angular/common';
import { SearchInputComponent } from '../../search-input/search-input.component';
import { TypeFilterComponent } from '../../type-filter/type-filter.component';
import { SearchService } from '../../../services/search/search.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ListNodeComponent,
    NgForOf,
    SearchInputComponent,
    JsonPipe,
    TypeFilterComponent,
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
