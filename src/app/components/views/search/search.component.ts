import { Component, OnInit } from '@angular/core';
import { ListNodeComponent } from '../../list-node/list-node.component';
import { JsonPipe, NgClass, NgForOf } from '@angular/common';
import { SearchInputComponent } from '../../search-input/search-input.component';
import { TypeFilterComponent } from '../../type-filter/type-filter.component';
import { SearchService } from '../../../services/search/search.service';
import { ViewModeSelectComponent } from '../../view-mode-select/view-mode-select.component';
import { ViewModeService } from '../../../services/view-mode.service';
import { ViewMode } from '../../../models/view-mode.enum';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    ListNodeComponent,
    NgForOf,
    SearchInputComponent,
    JsonPipe,
    TypeFilterComponent,
    ViewModeSelectComponent,
    NgClass,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  constructor(
    public search: SearchService,
    public viewMode: ViewModeService,
  ) {}

  ngOnInit() {}

  onScroll($event: any) {
    const hasReachedEnd =
      $event.target.offsetHeight + $event.target.scrollTop >=
      $event.target.scrollHeight;
    if (hasReachedEnd) {
      void this.search.execute();
    }
  }

  protected readonly ViewMode = ViewMode;
}
