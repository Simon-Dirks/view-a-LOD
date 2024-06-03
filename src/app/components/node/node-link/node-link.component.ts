import { Component, Input, OnInit } from '@angular/core';
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
export class NodeLinkComponent implements OnInit {
  @Input() url?: string;
  @Input() label?: string;
  @Input() labelUrl?: string;
  @Input() disabled?: boolean;
  @Input() shouldTruncate = true;
  @Input() allowLabelExpand = true;
  @Input() suffixStr = '';
  @Input() shouldHighlight = true;

  isClickableUrl = false;

  constructor(
    public cache: CacheService,
    public filters: FilterService,
    public search: SearchService,
  ) {}

  ngOnInit() {
    if (!this.labelUrl) {
      this.labelUrl = this.url;
    }

    const isValidAbsoluteUrl = this.url !== undefined && isValidUrl(this.url);
    this.isClickableUrl = isValidAbsoluteUrl && !this.disabled;
  }

  get cachedLabel(): string | undefined {
    if (this.label) {
      return this.label;
    }

    if (this?.labelUrl && isValidHttpUrl(this.labelUrl)) {
      void this.cache.cacheLabelForId(this.labelUrl);
      return this.cache.labels?.[this.labelUrl];
    }

    return this.url ? replacePrefixes(this.url) : undefined;
  }

  preventDefault(event: MouseEvent) {
    event.preventDefault();
  }

  onToggleFilterClicked(event: MouseEvent, type: FilterType) {
    this.preventDefault(event);
    if (!this.url || this.disabled) {
      return;
    }

    this.filters.toggle({
      valueId: this.url,
      type: type,
    });
  }

  protected readonly featherFilter = featherFilter;
  protected readonly NgxFloatUiPlacements = NgxFloatUiPlacements;
  protected readonly NgxFloatUiTriggers = NgxFloatUiTriggers;
  protected readonly featherExternalLink = featherExternalLink;
  protected readonly featherX = featherX;
  protected readonly FilterType = FilterType;
  protected readonly featherSearch = featherSearch;
  protected readonly wrapWithDoubleQuotes = wrapWithDoubleQuotes;
}
