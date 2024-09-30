import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PostCacheService {
  cache: {
    [key: string]: any;
  } = {};

  constructor() {}
}
