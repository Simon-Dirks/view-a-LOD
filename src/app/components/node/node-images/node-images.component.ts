import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Config } from '../../../config/config';
import { UrlService } from '../../../services/url.service';
import { Settings } from '../../../config/settings';
import OpenSeadragon, { Viewer } from 'openseadragon';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-node-images',
  standalone: true,
  imports: [NgForOf, NgIf, JsonPipe],
  templateUrl: './node-images.component.html',
  styleUrl: './node-images.component.scss',
  encapsulation: ViewEncapsulation.None,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NodeImagesComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  private _imageViewer?: Viewer;
  @ViewChild('viewerElem') viewerElem!: ElementRef;

  @ViewChild('swiperContainer') swiperContainerElem!: ElementRef;

  @Input() useViewer = false;
  @Input() imageUrls?: string[];

  processedImageUrls: string[] = [];

  constructor(
    public urlService: UrlService,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {}

  ngAfterViewInit() {
    this.initImageViewer(this.processedImageUrls);
    this.initSwiper();
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

  initSwiper() {
    const swiperParams: SwiperOptions = {
      slidesPerView: 2,
      breakpoints: {
        640: {
          slidesPerView: 4,
          pagination: {
            el: '.swiper-pagination',
            type: 'bullets',
            clickable: true,
          },
        },
      },
      allowTouchMove: true,
      autoHeight: true,
      direction: 'horizontal',
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        type: 'progressbar',
      },
      simulateTouch: true,
      spaceBetween: 5,
      threshold: 5,
      touchMoveStopPropagation: false,
      mousewheel: {
        forceToAxis: true,
      },
      freeMode: {
        enabled: true,
      },
      on: {
        init() {},
      },
    };

    Object.assign(this.swiperContainerElem.nativeElement, swiperParams);
    this.swiperContainerElem.nativeElement.initialize();
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
