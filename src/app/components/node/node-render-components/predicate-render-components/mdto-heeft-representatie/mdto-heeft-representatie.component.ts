import { Component, Input, type OnInit } from '@angular/core';
import { SparqlService } from '../../../../../services/sparql.service';
import { NgForOf, NgIf } from '@angular/common';
import { NodeImagesComponent } from '../../../node-images/node-images.component';
import { DocViewerComponent } from '../../../../doc-viewer/doc-viewer.component';

@Component({
  selector: 'app-mdto-heeft-representatie',
  standalone: true,
  imports: [NgIf, NgForOf, NodeImagesComponent, DocViewerComponent],
  templateUrl: './mdto-heeft-representatie.component.html',
  styleUrl: './mdto-heeft-representatie.component.css',
})
export class MdtoHeeftRepresentatieComponent implements OnInit {
  @Input() id: string = '';

  mdtoUrlBestand: string[] = [];

  loading = false;

  constructor(private sparql: SparqlService) {}

  ngOnInit(): void {
    void this.initMdtoUrlBestand();
  }

  private async initMdtoUrlBestand() {
    if (!this.id) {
      return;
    }

    const hops = [
      'http://www.nationaalarchief.nl/mdto#identificatie',
      'http://www.nationaalarchief.nl/mdto#identificatieKenmerk',
      'http://www.nationaalarchief.nl/mdto#URLBestand',
    ];

    this.loading = true;
    this.mdtoUrlBestand = await this.sparql
      .getObjIds(this.id, hops)
      .finally(() => {
        this.loading = false;
      });
    console.log('mdtoUrlBestand', this.mdtoUrlBestand);
  }

  isImageUrl(url: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    try {
      // Parse the URL and get just the pathname
      const urlObj = new URL(url);
      const path = urlObj.pathname.toLowerCase();
      return imageExtensions.some((ext) => path.endsWith(ext));
    } catch {
      // If URL parsing fails, fall back to simple string check
      const lowerUrl = url.toLowerCase();
      return imageExtensions.some((ext) => lowerUrl.endsWith(ext));
    }
  }
}
