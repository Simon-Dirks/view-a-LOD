import { Component, Input, type OnInit } from '@angular/core';
import { SparqlService } from '../../../../../services/sparql.service';
import { NgForOf, NgIf } from '@angular/common';
import { NodeImagesComponent } from '../../../node-images/node-images.component';
import { DocViewerComponent } from '../../../../doc-viewer/doc-viewer.component';
import { HopLinkSettingsModel } from '../../../../../models/settings/hop-link-settings.model';
import { NodeLinkComponent } from '../../../node-link/node-link.component';

@Component({
  selector: 'app-file-renderer',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NodeImagesComponent,
    DocViewerComponent,
    NodeLinkComponent,
  ],
  templateUrl: './file-renderer.component.html',
  styleUrl: './file-renderer.component.css',
})
export class FileRendererComponent implements OnInit {
  @Input() urls: string | string[] = [];
  @Input() hopSettings?: HopLinkSettingsModel;
  @Input() fullHeight = false;

  fileUrls: string[] = [];
  loading = false;

  constructor(private sparql: SparqlService) {}

  ngOnInit(): void {
    void this.initFileUrls();
  }

  private async initFileUrls() {
    const inputUrls = Array.isArray(this.urls) ? this.urls : [this.urls];

    const validUrls = inputUrls.filter((url) => url);

    if (validUrls.length === 0) {
      return;
    }

    this.loading = true;

    try {
      if (
        this.hopSettings &&
        this.hopSettings.preds &&
        this.hopSettings.preds.length > 0
      ) {
        const urlPromises = validUrls.map((url) =>
          this.sparql.getObjIds(url, this.hopSettings!.preds),
        );

        const results = await Promise.all(urlPromises);

        this.fileUrls = results.flat();
      } else {
        this.fileUrls = validUrls;
      }
    } finally {
      this.loading = false;
    }
  }

  isImageUrl(url: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    try {
      const urlObj = new URL(url);
      const path = urlObj.pathname.toLowerCase();
      return imageExtensions.some((ext) => path.endsWith(ext));
    } catch {
      const lowerUrl = url.toLowerCase();
      return imageExtensions.some((ext) => lowerUrl.endsWith(ext));
    }
  }
}
