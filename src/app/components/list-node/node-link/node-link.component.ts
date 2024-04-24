import { Component, Input, OnInit } from '@angular/core';
import { isValidHttpUrl, isValidUrl } from '../../../helpers/util.helper';
import { JsonPipe, NgClass, NgIf } from '@angular/common';
import { CacheService } from '../../../services/cache.service';
import { Router, RouterLink } from '@angular/router';

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

  constructor(
    public cache: CacheService,
    public router: Router,
  ) {}

  ngOnInit() {
    if (!this.labelUrl) {
      this.labelUrl = this.url;
    }
  }

  get cachedLabel(): string | undefined {
    if (this?.labelUrl && isValidHttpUrl(this.labelUrl)) {
      void this.cache.cacheLabelForId(this.labelUrl);
      return this.cache.labels?.[this.labelUrl] ?? this.label;
    }

    return this.label;
  }

  get isClickableUrl(): boolean {
    const isValidAbsoluteUrl = this.url !== undefined && isValidUrl(this.url);
    return (isValidAbsoluteUrl || this.isInternalLink) && !this.disabled;
  }

  onLinkClick(event: MouseEvent) {
    if (!this.isInternalLink || !this.url) {
      return;
    }

    event.preventDefault();
    void this.router.navigateByUrl(this.url);
  }
}
