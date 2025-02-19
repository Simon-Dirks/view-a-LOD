import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IIIFService {
  private _blobUrls: Set<string> = new Set();

  constructor() {}

  generateManifest(imgUrls: string[]) {
    return {
      '@context': 'http://iiif.io/api/presentation/3/context.json',
      id: 'https://example.org/manifest.json',
      type: 'Manifest',
      label: { en: ['Image Collection'] },
      items: imgUrls.map((url, index) => ({
        id: `https://example.org/canvas/p${index + 1}`,
        type: 'Canvas',
        height: 1800,
        width: 1200,
        items: [
          {
            id: `https://example.org/page/p${index + 1}/1`,
            type: 'AnnotationPage',
            items: [
              {
                id: `https://example.org/annotation/p${index + 1}-image`,
                type: 'Annotation',
                motivation: 'painting',
                body: {
                  id: url,
                  type: 'Image',
                  format: 'image/jpeg',
                  height: 1800,
                  width: 1200,
                },
                target: `https://example.org/canvas/p${index + 1}`,
              },
            ],
          },
        ],
      })),
    };
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
