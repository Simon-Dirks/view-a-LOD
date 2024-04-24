import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  constructor() {}

  getDetailsPageUrl(id: string) {
    return `/details/${encodeURIComponent(id)}`;
  }
}
