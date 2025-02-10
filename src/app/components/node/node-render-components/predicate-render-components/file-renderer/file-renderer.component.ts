import { Component, Input, type OnInit } from '@angular/core';
import { SparqlService } from '../../../../../services/sparql.service';
import { NgForOf, NgIf } from '@angular/common';
import { NodeImagesComponent } from '../../../node-images/node-images.component';
import { DocViewerComponent } from '../../../../doc-viewer/doc-viewer.component';
import { HopLinkSettingsModel } from '../../../../../models/settings/hop-link-settings.model';
import { NodeLinkComponent } from "../../../node-link/node-link.component";

@Component({
  selector: 'app-file-renderer',
  standalone: true,
  imports: [NgIf, NgForOf, NodeImagesComponent, DocViewerComponent, NodeLinkComponent],
  templateUrl: './file-renderer.component.html',
  styleUrl: './file-renderer.component.css',
})
export class FileRendererComponent implements OnInit {
  @Input() url: string = '';
  @Input() hopSettings?: HopLinkSettingsModel;

  fileUrls: string[] = [];
  loading = false;

  constructor(private sparql: SparqlService) {}

  ngOnInit(): void {
    void this.initFileUrls();
  }

  private async initFileUrls() {
    if (!this.url) {
      return;
    }

    this.loading = true;

    try {
      if (
        this.hopSettings &&
        this.hopSettings.preds &&
        this.hopSettings.preds.length > 0
      ) {
        this.fileUrls = await this.sparql.getObjIds(
          this.url,
          this.hopSettings.preds,
        );
      } else {
        this.fileUrls = [this.url];
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
