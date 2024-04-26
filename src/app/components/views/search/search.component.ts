import { Component, OnInit } from '@angular/core';
import { NodeComponent } from '../../node/node.component';
import { JsonPipe, NgClass, NgForOf, NgIf, NgStyle } from '@angular/common';
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
    NodeComponent,
    NgForOf,
    SearchInputComponent,
    JsonPipe,
    TypeFilterComponent,
    ViewModeSelectComponent,
    NgClass,
    NgxMasonryModule,
    NgStyle,
    NgIf,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  updateMasonryLayoutTrigger = false;

  constructor(
    public search: SearchService,
    public viewModes: ViewModeService,
  ) {}

  ngOnInit() {
    this.initMasonryLayoutUpdates();
  }

  initMasonryLayoutUpdates() {
    this.viewModes.current.subscribe((viewMode) => this.updateMasonryLayout());

    // TODO: Optimize if needed, fixes occasional layout errors after reactive component height changes
    setInterval(() => {
      if (this.viewModes.current.value === ViewMode.Grid) {
        this.updateMasonryLayout();
      }
    }, 200);
  }

  updateMasonryLayout() {
    this.updateMasonryLayoutTrigger = true;
    setTimeout(() => {
      this.updateMasonryLayoutTrigger = false;
    }, 10);
  }

  get gridNodeWidthStr(): string {
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
