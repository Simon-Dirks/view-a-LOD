import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  delay,
  lastValueFrom,
  retryWhen,
  scan,
  throwError,
} from 'rxjs';
import { PostCacheService } from './cache/post-cache.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private http: HttpClient,
    private postCache: PostCacheService,
  ) {}

  async fetchData<T>(url: string): Promise<T> {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return Promise.reject(new Error('Network response was not ok'));
      }
      return (await response.json()) as T;
    } catch (error) {
      console.error('There was a problem with the API request:', error);
      throw error;
    }
  }

  async postData<T>(
    url: string,
    data: any,
    maxRetries: number = 3,
    retryInterval: number = 2000,
  ): Promise<T> {
    const dataStr = JSON.stringify(data);
    const requestKey = `${url}|||${dataStr}`;
    const requestIsCached = requestKey in this.postCache.cache;
    if (requestIsCached) {
      // console.log('Cache:', url, dataStr.slice(0, 200));
      return this.postCache.cache[requestKey];
    }

    const promise = lastValueFrom(
      this.http.post<T>(url, data).pipe(
        catchError((error) => {
          console.error('There was a problem with the API request:', error);
          return throwError(error);
        }),
        retryWhen((errors) =>
          errors.pipe(
            scan((retryCount, error) => {
              if (retryCount >= maxRetries) {
                throw error;
              }
              console.log(`Retrying in ${retryInterval / 1000} seconds...`);
              return retryCount + 1;
            }, 0),
            delay(retryInterval),
          ),
        ),
      ),
    );

    promise.then((response) => {
      this.postCache.cache[requestKey] = response;
    });

    return promise;
  }
}
