import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  constructor() {}

  private _addParamToUrl(
    url: string,
    paramName: string,
    paramValue: string,
  ): string {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set(paramName, paramValue);
      return urlObj.toString();
    } catch (error) {
      console.error('Invalid URL:', error);
      return url;
    }
  }

  processUrls(urls: string[]): string[] {
    return urls.map((url) => this.processUrl(url));
  }

  processUrl(url: string): string {
    if (url.includes('opslag.razu.nl')) {
      url = this._addParamToUrl(
        url,
        'token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTE3MDY0NjQsIm5iZiI6MTcxMTcwNjQ2NCwiZXhwIjoxNzQzMjQyNDY0fQ.ViNS0wWml0EwkF0z75G4cNZxKupYQMLiVB_PQ5kNQm8',
      );
    }

    url = url.replaceAll(
      'hetutrechtsarchief.nl/id',
      'hetutrechtsarchief.nl/collectie',
    );

    return url;
  }
}
