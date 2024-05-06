import { Component, OnInit } from '@angular/core';
import { NodeComponent } from '../../node/node.component';
import { JsonPipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
import { SearchInputComponent } from '../../search-input/search-input.component';
import { SearchService } from '../../../services/search/search.service';
import { ViewModeSelectComponent } from '../../view-mode-select/view-mode-select.component';
import { ViewMode } from '../../../models/view-mode.enum';
import { NgxMasonryModule } from 'ngx-masonry';
import { ViewModeService } from '../../../services/view-mode.service';
import { NodesMasonryGridComponent } from '../../nodes-masonry-grid/nodes-masonry-grid.component';
import { ActiveFiltersComponent } from '../../active-filters/active-filters.component';
import { NodesGridComponent } from '../../nodes-grid/nodes-grid.component';
import { FilterOptionsComponent } from '../../filter-options/filter-options.component';
import { Settings } from '../../../config/settings';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    NodeComponent,
    NgForOf,
    SearchInputComponent,
    JsonPipe,
    ViewModeSelectComponent,
    NgClass,
    NgxMasonryModule,
    NgStyle,
    NgIf,
    NodesMasonryGridComponent,
    ActiveFiltersComponent,
    NodesGridComponent,
    FilterOptionsComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  constructor(
    public search: SearchService,
    public viewModes: ViewModeService,
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
  protected readonly Settings = Settings;
}
