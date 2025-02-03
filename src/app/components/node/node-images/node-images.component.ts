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
  ViewEncapsulation,
} from '@angular/core';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { Config } from '../../../config/config';
import { UrlService } from '../../../services/url.service';
import { Settings } from '../../../config/settings';
// @ts-ignore
import Mirador from 'mirador/dist/es/src/index';

@Component({
  selector: 'app-node-images',
  standalone: true,
  imports: [NgForOf, NgIf, JsonPipe, NgClass],
  templateUrl: './node-images.component.html',
  styleUrl: './node-images.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class NodeImagesComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewInit
{
  private _imageViewer?: any;

  @Input() imageUrls?: string[];
  @Input() shownInTableCell = true;
  @Input() useViewer = true;
  @Input() showAsThumb = false;
  @Input() imageLabel?: string;

  processedImageUrls: string[] = [];

  constructor(
    public urlService: UrlService,
    private ngZone: NgZone,
  ) {}

  ngOnInit() {
    this._processImageUrls();
  }

  ngAfterViewInit() {
    if (this.processedImageUrls.length > 0) {
      this.initImageViewer(this.processedImageUrls);
    }
  }

  destroyImageViewer() {
    if (this._imageViewer) {
      this._imageViewer = undefined;
    }
  }

  initImageViewer(imgUrls: string[]) {
    if (!this.useViewer) {
      return;
    }
    if (!imgUrls.length) {
      return;
    }

    this.destroyImageViewer();

    this._imageViewer = this.ngZone.runOutsideAngular(() => {
      return Mirador.viewer({
        id: 'mirador',
        windows: [
          {
            manifestId:
              'https://iiif.bodleian.ox.ac.uk/iiif/manifest/e32a277e-91e2-4a6d-8ba6-cc4bad230410.json',
            allowClose: false,
            allowFullscreen: true,
            sideBarOpen: false,
          },
        ],
        workspace: {
          type: 'single',
          showZoomControls: true,
        },
        workspaceControlPanel: {
          enabled: false,
        },
        window: {
          allowWindowSideBar: false,
          sideBarOpenByDefault: false,
          allowTopMenuButton: false,
          allowMaximize: false,
        },
      });
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
    // this.processedImageUrls = [
    //   'https://placehold.co/600x400/EEE/31343C',
    //   'https://placehold.co/600x400/EEE/red',
    //   'https://placehold.co/600x400/EEE/blue',
    //   'https://placehold.co/600x400/EEE/green',
    //   'https://placehold.co/600x400/EEE/31343C',
    //   'https://placehold.co/600x400/EEE/red',
    //   'https://placehold.co/600x400/EEE/blue',
    //   'https://placehold.co/600x400/EEE/green',
    // ];
    this.initImageViewer(this.processedImageUrls);
  }

  onImageLoadError($event: ErrorEvent) {
    ($event.target as any).src = Settings.imageForWhenLoadingFails;
  }

  protected readonly Config = Config;
}
