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
import { HeaderComponent } from '../../header/header.component';
import { ViewContainerComponent } from '../view-container/view-container.component';
import { HomeIntroComponent } from '../../home-intro/home-intro.component';
import { Router } from '@angular/router';
import { DrawerComponent } from '../../drawer/drawer.component';
import { NodeService } from '../../../services/node.service';
import { ScrollService } from '../../../services/scroll.service';
import { DetailsService } from '../../../services/details.service';
import { HomeIntroBelowSearchComponent } from '../../home-intro/home-intro-below-search/home-intro-below-search.component';
import { DetailsComponent } from '../details/details.component';
import { SortSelectComponent } from '../../sort-select/sort-select.component';
import { LoadMoreSearchResultsButtonComponent } from '../../search/load-more-search-results-button/load-more-search-results-button.component';
import { SearchHitsCounterComponent } from '../../search/search-hits-counter/search-hits-counter.component';
import { FilterPanelLocation } from '../../../models/settings/filter-panel-location.enum';
import { SettingsService } from '../../../services/settings.service';
import { DetailsBackButtonComponent } from '../../details-back-button/details-back-button.component';
import { filter } from 'rxjs';
import { LangSwitchComponent } from '../../lang-switch/lang-switch.component';

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
    DetailsComponent,
    SortSelectComponent,
    LoadMoreSearchResultsButtonComponent,
    SearchHitsCounterComponent,
    DetailsBackButtonComponent,
    LangSwitchComponent,
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
    public settings: SettingsService,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.scroll.initScrollContainer(this.scrollContainer);
  }

  get shouldShowHomeIntro(): boolean {
    // TODO: Better way to determine whether or not to show home
    if (this.router.url === '' || this.router.url === '/') {
      return true;
    }

    return (
      !this.details.showing.value &&
      !this.search.hasDoneInitialSearch &&
      this.search.queryStr === ''
    );
  }

  protected readonly ViewMode = ViewMode;
  protected readonly Settings = Settings;
  protected readonly FilterPanelLocation = FilterPanelLocation;
  protected readonly filter = filter;
}
