import { Component, Input, OnInit } from '@angular/core';
import {
  isValidHttpUrl,
  isValidUrl,
  replacePrefixes,
} from '../../../helpers/util.helper';
import { JsonPipe, NgClass, NgIf } from '@angular/common';
import { CacheService } from '../../../services/cache.service';
import { Router, RouterLink } from '@angular/router';
import { FilterService } from '../../../services/search/filter.service';
import {
  featherExternalLink,
  featherFilter,
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
  ],
  templateUrl: './node-link.component.html',
  styleUrl: './node-link.component.scss',
})
export class NodeLinkComponent implements OnInit {
  @Input() url?: string;
  @Input() label?: string;
  @Input() labelUrl?: string;
  @Input() disabled?: boolean;
  @Input() truncate = true;

  constructor(
    public cache: CacheService,
    public router: Router,
    public filters: FilterService,
  ) {}

  ngOnInit() {
    if (!this.labelUrl) {
      this.labelUrl = this.url;
    }
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

  get isClickableUrl(): boolean {
    const isValidAbsoluteUrl = this.url !== undefined && isValidUrl(this.url);
    return isValidAbsoluteUrl && !this.disabled;
  }

  preventDefault(event: MouseEvent) {
    event.preventDefault();
  }

  onToggleFilterClicked(event: MouseEvent) {
    this.preventDefault(event);
    if (!this.url) {
      return;
    }

    this.filters.toggle({
      id: this.url,
    });
  }

  protected readonly featherFilter = featherFilter;
  protected readonly NgxFloatUiPlacements = NgxFloatUiPlacements;
  protected readonly NgxFloatUiTriggers = NgxFloatUiTriggers;
  protected readonly featherExternalLink = featherExternalLink;
  protected readonly featherX = featherX;
}
