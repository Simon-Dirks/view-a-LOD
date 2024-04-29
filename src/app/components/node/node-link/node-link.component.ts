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

@Component({
  selector: 'app-node-link',
  standalone: true,
  imports: [NgIf, NgClass, JsonPipe, RouterLink],
  templateUrl: './node-link.component.html',
  styleUrl: './node-link.component.scss',
})
export class NodeLinkComponent implements OnInit {
  @Input() url?: string;
  @Input() label?: string;
  @Input() labelUrl?: string;
  @Input() disabled?: boolean;
  @Input() isInternalLink = false;
  @Input() clickToFilter = true;

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
    return (isValidAbsoluteUrl || this.isInternalLink) && !this.disabled;
  }

  onLinkClick(event: MouseEvent) {
    if (!this.url) {
      return;
    }

    if (this.isInternalLink) {
      event.preventDefault();
      void this.router.navigateByUrl(this.url);
      return;
    }

    if (this.clickToFilter) {
      event.preventDefault();
      this.filters.toggle({
        id: this.url,
      });
    }
  }
}
