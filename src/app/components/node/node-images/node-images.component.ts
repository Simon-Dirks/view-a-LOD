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
  private _imageViewer?: Viewer;
  @ViewChild('viewerElem') viewerElem!: ElementRef;

  @Input() useViewer = false;
  @Input() imageUrls?: string[];
  @Input() width = '5rem';

  processedImageUrls: string[] = [];

  constructor(
    public urlService: UrlService,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initImageViewer(this.processedImageUrls);
    this._processImageUrls();
  }

  // TODO: Refactor OSD into separate component
  destroyImageViewer() {
    if (this._imageViewer) {
      this._imageViewer.destroy();
    }
  }

  initImageViewer(imgUrls: string[]) {
    if (!this.useViewer) {
      return;
    }

    if (!this.viewerElem) {
      // TODO
      console.warn('Viewer elem not yet initialized');
      return;
    }

    this.destroyImageViewer();

    const sources: any = imgUrls.map((imgUrl) => {
      return { type: 'image', url: imgUrl };
    });

    this._imageViewer = this.ngZone.runOutsideAngular(() =>
      OpenSeadragon({
        element: this.viewerElem.nativeElement,
        prefixUrl: 'assets/osd/images/',
        sequenceMode: true,
        showReferenceStrip: true,
        // referenceStripScroll: 'vertical',
        // showNavigator: true,
        tileSources: sources,
        maxZoomPixelRatio: 5,
      }),
    );

    this._imageViewer.addHandler('open-failed', () => {
      this.initImageViewer([Settings.imageForWhenLoadingFails]);
    });

    this._imageViewer.addHandler('tile-loaded', (event) => {
      if (!this._imageViewer) {
        return;
      }

      const initialBounds = this._imageViewer.viewport.getBounds();
      const alignImageToTopBounds = new OpenSeadragon.Rect(
        0,
        0,
        1,
        initialBounds.height / initialBounds.width,
      );
      this._imageViewer.viewport.fitBounds(alignImageToTopBounds, true);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrls']) {
      this._processImageUrls();
    }
  }

  ngOnDestroy() {
    this.destroyImageViewer();
  }

  private _processImageUrls() {
    if (!this.imageUrls) {
      return;
    }

    this.processedImageUrls = this.urlService.processUrls(
      this.imageUrls,
      false,
    );
    this.initImageViewer(this.processedImageUrls);
  }

  protected readonly Config = Config;

  onImageLoadError($event: ErrorEvent) {
    ($event.target as any).src = Settings.imageForWhenLoadingFails;
  }
}
