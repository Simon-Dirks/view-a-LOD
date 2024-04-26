import { Component, OnInit } from '@angular/core';
import { ListNodeComponent } from '../../list-node/list-node.component';
import { JsonPipe, NgClass, NgForOf, NgStyle } from '@angular/common';
import { SearchInputComponent } from '../../search-input/search-input.component';
import { TypeFilterComponent } from '../../type-filter/type-filter.component';
import { SearchService } from '../../../services/search/search.service';
import { ViewModeSelectComponent } from '../../view-mode-select/view-mode-select.component';
import { ViewMode } from '../../../models/view-mode.enum';
import { NgxMasonryModule } from 'ngx-masonry';
import { ViewModeService } from '../../../services/view-mode.service';

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
    NgxMasonryModule,
    NgStyle,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  updateMasonryLayout = false;

  constructor(
    public search: SearchService,
    public viewModes: ViewModeService,
  ) {}

  ngOnInit() {
    this.initMasonryLayoutUpdates();
  }

  initMasonryLayoutUpdates() {
    this.viewModes.current.subscribe((viewMode) => {
      this.updateMasonryLayout = true;
      setTimeout(() => {
        this.updateMasonryLayout = false;
      });
    });
  }

  get listNodeWidthStr(): string {
    let columns = 1;
    if (this.viewModes.current.value === ViewMode.Grid) {
      columns = 2;
    }
    return (100 / columns).toString() + '%';
  }

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
