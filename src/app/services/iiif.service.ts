import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IIIFService {
  private _blobUrls: Set<string> = new Set();

  private _mockManifest = {
    '@context': 'http://iiif.io/api/presentation/3/context.json',
    id: 'https://preview.iiif.io/cookbook/master/recipe/0001-mvm-image/manifest.json',
    type: 'Manifest',
    label: {
      en: ['Image 1'],
    },
    items: [
      {
        id: 'https://preview.iiif.io/cookbook/master/recipe/0001-mvm-image/canvas/p1',
        type: 'Canvas',
        height: 1800,
        width: 1200,
        items: [
          {
            id: 'https://preview.iiif.io/cookbook/master/recipe/0001-mvm-image/page/p1/1',
            type: 'AnnotationPage',
            items: [
              {
                id: 'https://preview.iiif.io/cookbook/master/recipe/0001-mvm-image/annotation/p0001-image',
                type: 'Annotation',
                motivation: 'painting',
                body: {
                  id: 'http://iiif.io/api/presentation/2.1/example/fixtures/resources/page1-full.png',
                  type: 'Image',
                  format: 'image/png',
                  height: 1800,
                  width: 1200,
                },
                target:
                  'https://preview.iiif.io/cookbook/master/recipe/0001-mvm-image/canvas/p1',
              },
            ],
          },
        ],
      },
    ],
  };

  constructor() {}

  generateManifest(imgUrls: string[]) {
    return this._mockManifest;
  }

  createManifestBlob(imgUrls: string[]) {
    const manifest = this.generateManifest(imgUrls);
    const manifestFile = new File([JSON.stringify(manifest)], 'manifest.json', {
      type: 'application/json',
    });
    const manifestUrl = URL.createObjectURL(manifestFile);
    this._blobUrls.add(manifestUrl);

    window.addEventListener('beforeunload', () => this._cleanup());

    return manifestUrl;
  }

  private _cleanup() {
    this._blobUrls.forEach((url) => URL.revokeObjectURL(url));
    this._blobUrls.clear();
  }
}
