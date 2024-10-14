import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Config } from '../../../config/config';
import { UrlService } from '../../../services/url.service';
import { Settings } from '../../../config/settings';
import OpenSeadragon, { Viewer } from 'openseadragon';

@Component({
  selector: 'app-node-images',
  standalone: true,
  imports: [NgForOf, NgIf, JsonPipe],
  templateUrl: './node-images.component.html',
  styleUrl: './node-images.component.scss',
})
export class NodeImagesComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  private imageViewer?: Viewer;

  @ViewChild('viewerElem') viewerElem!: ElementRef;

  @Input() imageUrls?: string[];
  @Input() width = '5rem';

  processedImageUrls: string[] = [];

  constructor(
    public urlService: UrlService,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    this.processImageUrls();
  }

  ngAfterViewInit() {
    this.initImageViewer();
  }

  initImageViewer() {
    this.imageViewer = this.ngZone.runOutsideAngular(() =>
      OpenSeadragon({
        element: this.viewerElem.nativeElement,
        prefixUrl: 'assets/osd/images/',
        tileSources: {
          type: 'image',
          url: 'https://openseadragon.github.io/example-images/grand-canyon-landscape-overlooking.jpg',
        },
      }),
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrls']) {
      this.processImageUrls();
    }
  }

  ngOnDestroy() {
    if (this.imageViewer) {
      this.imageViewer.destroy();
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
