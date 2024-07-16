import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  isValidHttpUrl,
  isValidUrl,
  replacePrefixes,
  wrapWithDoubleQuotes,
} from '../../../helpers/util.helper';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { CacheService } from '../../../services/cache.service';
import { RouterLink } from '@angular/router';
import { FilterService } from '../../../services/search/filter.service';
import {
  featherExternalLink,
  featherFilter,
  featherMaximize2,
  featherSearch,
  featherX,
} from '@ng-icons/feather-icons';
import { NgIcon } from '@ng-icons/core';
import {
  NgxFloatUiContentComponent,
  NgxFloatUiDirective,
  NgxFloatUiModule,
  NgxFloatUiPlacements,
  NgxFloatUiTriggers,
} from 'ngx-float-ui';
import { NodeLabelComponent } from '../node-label/node-label.component';
import { FilterType } from '../../../models/filter.model';
import { SearchService } from '../../../services/search/search.service';
import { DrawerService } from '../../../services/drawer.service';
import { UrlService } from '../../../services/url.service';

@Component({
  selector: 'app-node-link',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    JsonPipe,
    RouterLink,
    NgIcon,
    NgxFloatUiContentComponent,
    NgxFloatUiDirective,
    NgxFloatUiModule,
    NodeLabelComponent,
    NgForOf,
  ],
  templateUrl: './node-link.component.html',
  styleUrl: './node-link.component.scss',
})
export class NodeLinkComponent implements OnInit, OnChanges {
  @Input() url?: string;
  processedUrl?: string = this.url;
  @Input() label?: string;
  @Input() labelUrl?: string;
  @Input() disabled?: boolean;
  @Input() shouldTruncate = true;
  @Input() allowLabelExpand = true;
  @Input() suffixStr = '';
  @Input() shouldHighlight = true;

  @Output() clicked: EventEmitter<MouseEvent> = new EventEmitter<MouseEvent>();

  isClickableUrl = false;

  constructor(
    public cache: CacheService,
    public filters: FilterService,
    public search: SearchService,
    public urlService: UrlService,
    private drawer: DrawerService,
  ) {}

  ngOnInit() {
    if (!this.labelUrl) {
      this.labelUrl = this.url;
    }

    this.processUrl();

    const isValidAbsoluteUrl =
      this.processedUrl !== undefined && isValidUrl(this.processedUrl);
    this.isClickableUrl = isValidAbsoluteUrl && !this.disabled;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['url']) {
      this.processUrl();
    }
  }

  openDrawer(processedUrl: any): void {
    const dynamicContent = [processedUrl]; // Dynamic content here
    this.drawer.setDrawerItems(dynamicContent);
  }

  processUrl() {
    if (!this.url) {
      return;
    }

    this.processedUrl = this.urlService.processUrl(this.url);
  }

  get cachedLabel(): string | undefined {
    if (this.label) {
      return this.label;
    }

    if (this?.labelUrl && isValidHttpUrl(this.labelUrl)) {
      void this.cache.cacheLabelForId(this.labelUrl);
      return this.cache.labels?.[this.labelUrl];
    }

    return this.processedUrl ? replacePrefixes(this.processedUrl) : undefined;
  }

  onUrlClicked(event: MouseEvent) {
    this.clicked.emit(event);

    if (!this.processedUrl || !this.isClickableUrl || this.disabled) {
      this._preventDefault(event);
      return;
    }
  }

  private _preventDefault(event: MouseEvent) {
    event.preventDefault();
  }

  protected readonly featherFilter = featherFilter;
  protected readonly NgxFloatUiPlacements = NgxFloatUiPlacements;
  protected readonly NgxFloatUiTriggers = NgxFloatUiTriggers;
  protected readonly featherExternalLink = featherExternalLink;
  protected readonly featherX = featherX;
  protected readonly featherMaximize2 = featherMaximize2;
  protected readonly FilterType = FilterType;
  protected readonly featherSearch = featherSearch;
  protected readonly wrapWithDoubleQuotes = wrapWithDoubleQuotes;
}
