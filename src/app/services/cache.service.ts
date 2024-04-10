import { Injectable } from '@angular/core';
import { SparqlService } from './sparql.service';
import { replacePrefixes } from '../helpers/util.helper';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private _ids: Set<string> = new Set();
  labels: { [id: string]: string } = {};

  constructor(public sparql: SparqlService) {}

  async cacheLabelForId(id: string) {
    if (!id) {
      return;
    }
    this._ids.add(id);
    for (const idToCache of this._ids) {
      if (!this.labels?.[idToCache]) {
        this.labels[idToCache] = replacePrefixes(idToCache);
        this.labels[idToCache] = await this.sparql.getRdfsLabel(idToCache);
      }
    }
  }
}
