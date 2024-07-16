import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NodeComponent } from '../../node/node.component';
import {
  CommonModule,
  JsonPipe,
  NgClass,
  NgForOf,
  NgIf,
  NgStyle,
} from '@angular/common';
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
import { ViewContainerComponent } from '../view-container/view-container.component';
import { HomeIntroComponent } from '../../home-intro/home-intro.component';
import { Router } from '@angular/router';
import { DrawerComponent } from '../../drawer/drawer.component';
import { NodeService } from '../../../services/node.service';
import { ScrollService } from '../../../services/scroll.service';
import { DetailsService } from '../../../services/details.service';
import { HomeIntroBelowSearchComponent } from '../../home-intro/home-intro-below-search/home-intro-below-search.component';

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
    ViewContainerComponent,
    HomeIntroComponent,
    CommonModule,
    DrawerComponent,
    HomeIntroBelowSearchComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(
    public search: SearchService,
    public viewModes: ViewModeService,
    public router: Router,
    public nodes: NodeService,
    public scroll: ScrollService,
    public details: DetailsService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.scroll.initScrollContainer(this.scrollContainer);
  }

  loadMore() {
    if (!this.search.isLoading.value) {
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

  get shouldShowHomeIntro(): boolean {
    if (this.router.url === '' || this.router.url === '/') {
      return true;
    }

    return !this.search.hasDoneInitialSearch && this.search.queryStr === '';
  }

  protected readonly ViewMode = ViewMode;
  protected readonly Settings = Settings;
}
