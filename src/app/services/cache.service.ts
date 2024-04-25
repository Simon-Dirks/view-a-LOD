import { Injectable } from '@angular/core';
import { SparqlService } from './sparql.service';
import { Config } from '../config/config';
import { replacePrefixes } from '../helpers/util.helper';

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  private _idsToCache: Set<string> = new Set();
  private _idsBeingCached: Set<string> = new Set();
  labels: { [id: string]: string } = {};

  constructor(public sparql: SparqlService) {
    void this._scheduleBatchCacheRequests();
  }

  async _scheduleBatchCacheRequests() {
    setInterval(
      () => this.cacheQueuedLabelsInBatch(),
      Config.labelFetchIntervalMs,
    );
  }

  async cacheQueuedLabelsInBatch() {
    const idsWithoutLabel: string[] = Array.from(this._idsToCache).filter(
      (id) => {
        const labelAlreadyDefined = Object.keys(this.labels).includes(id);
        const alreadyRetrievingLabel = this._idsBeingCached.has(id);
        return !labelAlreadyDefined && !alreadyRetrievingLabel;
      },
    );

    if (!idsWithoutLabel || idsWithoutLabel.length === 0) {
      return;
    }

    idsWithoutLabel.map((id) => {
      this._idsBeingCached.add(id);

      // While loading, set label based on ID as a fallback (also in case no label is retrieved)
      const labelAlreadyDefined = id in this.labels;
      if (!labelAlreadyDefined) {
        this.labels[id] = replacePrefixes(id);
      }
    });

    // console.log('RETRIEVING LABELS BATCH', idsWithoutLabel);
    const idsAndLabels = await this.sparql.getRdfsLabels(idsWithoutLabel);
    // console.log('RETRIEVED LABELS BATCH', idsAndLabels);

    for (const idAndLabel of idsAndLabels) {
      const id = idAndLabel['@id'];
      this.labels[id] = idAndLabel.label;
      this._idsBeingCached.delete(id);
    }
  }

  async cacheLabelForId(id: string): Promise<string> {
    if (!id) {
      return 'N/A';
    }
    this._idsToCache.add(id);

    return this.labels?.[id] ?? replacePrefixes(id);
  }
}
