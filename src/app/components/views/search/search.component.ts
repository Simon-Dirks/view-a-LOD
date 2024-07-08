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
import { ActiveFiltersComponent } from '../../filters/active-filters/active-filters.component';
import { NodesGridComponent } from '../../nodes-grid/nodes-grid.component';
import { FilterOptionsComponent } from '../../filters/filter-options/filter-options.component';
import { Settings } from '../../../config/settings';
import { EndpointsComponent } from '../../filters/endpoints/endpoints.component';
import { formatNumber } from '../../../helpers/util.helper';
import { HeaderComponent } from '../../header/header.component';

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
    EndpointsComponent,
    HeaderComponent,
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
    if (hasReachedEnd && !this.search.isLoading.value) {
      void this.search.execute();
    }
  }

  get numberOfHitsStr(): string {
    if (!this.search.numberOfHits) {
      return 'Geen resultaten gevonden';
    }
    if (this.search.numberOfHits === 1) {
      return '1 resultaat';
    }
    return `${formatNumber(this.search.numberOfHits)}${this.search.moreHitsAreAvailable ? '+' : ''} resultaten`;
  }

  protected readonly ViewMode = ViewMode;
  protected readonly Settings = Settings;
}
