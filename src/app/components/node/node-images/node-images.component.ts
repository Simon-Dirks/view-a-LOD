import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Config } from '../../../config/config';
import { UrlService } from '../../../services/url.service';
import { Settings } from '../../../config/settings';

@Component({
  selector: 'app-node-images',
  standalone: true,
  imports: [NgForOf, NgIf, JsonPipe],
  templateUrl: './node-images.component.html',
  styleUrl: './node-images.component.scss',
})
export class NodeImagesComponent implements OnInit, OnChanges {
  @Input() imageUrls?: string[];
  @Input() width = '5rem';

  processedImageUrls: string[] = [];

  constructor(public urlService: UrlService) {}

  ngOnInit() {
    this.processImageUrls();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrls']) {
      this.processImageUrls();
    }
  }

  private processImageUrls() {
    if (!this.imageUrls) {
      return;
    }

    this.processedImageUrls = this.urlService.processUrls(this.imageUrls);
  }

  protected readonly Config = Config;

  onImageLoadError($event: ErrorEvent) {
    ($event.target as any).src = Settings.imageForWhenLoadingFails;
  }
}
