import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CdnService {
  private serverIp: string = '192.168.1.1'; // Replace with actual server IP

  constructor(private http: HttpClient) {}

  private _addParamToUrl(url: string, paramName: string, paramValue: string): string {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set(paramName, paramValue);
      return urlObj.toString();
    } catch (error) {
      console.error('Invalid URL:', error);
      return url;
    }
  }

  processUrls(urls: string[]): Observable<string[]> {
    return forkJoin(urls.map(url => this.processUrl(url)));
  }

  public processUrl(url: string): Observable<string> {
    if (!url.includes('opslag.razu.nl')) {
      return of(url);
    }

    const domain = this.extractDomain(url);
    const filename = this.extractFilename(url);

    return this.generateToken(domain, filename).pipe(
      map(token => this._addParamToUrl(url, 'token', token)),
      catchError(error => {
        console.error('Token generation failed:', error);
        return of(url);
      })
    );
  }

  private extractDomain(url: string): string {
    const domainMatch = url.match(/https?:\/\/([^\.]+)\.opslag\.razu\.nl/);
    return domainMatch ? domainMatch[1] : '';
  }

private extractFilename(url: string): string {
  // Extract the part after the last '/'
  const lastSegment = url.substring(url.lastIndexOf('/') + 1);
  // Remove any query parameters if present
  return lastSegment.split('?')[0];
}

  private generateToken(domain: string, filename: string): Observable<string> {
    const headers = new HttpHeaders({
      'ip': this.serverIp,
      'domain': domain,
      'file': filename,
    });

    return this.http.post<{ token: string }>('http://localhost:3000/generate-token', {}, { headers })
      .pipe(
        map(response => response.token)
      );
  }
}
