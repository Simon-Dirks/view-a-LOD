import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, lastValueFrom, throwError } from 'rxjs';
import { PostCacheService } from './cache/post-cache.service';
import { Settings } from '../config/settings';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private requestQueue: (() => Promise<any>)[] = [];
  private activeRequests = 0;

  constructor(
    private http: HttpClient,
    private postCache: PostCacheService,
  ) {}

  async postData<T>(url: string, data: any): Promise<T> {
    const dataStr = JSON.stringify(data);
    const requestKey = `${url}|||${dataStr}`;
    const requestIsCached = requestKey in this.postCache.cache;

    if (requestIsCached) {
      // console.log('Cache:', url, dataStr.slice(0, 200));
      return this.postCache.cache[requestKey];
    }

    return new Promise<T>((resolve, reject) => {
      const request = async () => {
        try {
          const response = await lastValueFrom(
            this.http.post<T>(url, data).pipe(
              catchError((error) => {
                console.error(
                  'There was a problem with the API request:',
                  error,
                );
                reject(error);
                return throwError(() => error);
              }),
            ),
          );
          this.postCache.cache[requestKey] = response;
          resolve(response);
        } catch (error) {
          reject(error);
        } finally {
          this.activeRequests--;
          this._processQueue();
        }
      };

      this.requestQueue.push(request);
      this._processQueue();
    });
  }

  private _processQueue() {
    while (
      this.activeRequests < Settings.maxNumParallelRequests &&
      this.requestQueue.length > 0
    ) {
      const nextRequest = this.requestQueue.shift();
      if (nextRequest) {
        this.activeRequests++;
        void nextRequest();
      }
    }
  }
}
