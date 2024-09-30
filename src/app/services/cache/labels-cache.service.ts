import { Injectable } from '@angular/core';
import { SparqlService } from '../sparql.service';
import { Config } from '../../config/config';
import { replacePrefixes } from '../../helpers/util.helper';

@Injectable({
  providedIn: 'root',
})
export class LabelsCacheService {
  private _idsToCacheLabelFor: Set<string> = new Set();
  private _labelsBeingCachedForIds: Set<string> = new Set();
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
    const idsWithoutLabel: string[] = Array.from(
      this._idsToCacheLabelFor,
    ).filter((id) => {
      const labelAlreadyDefined = Object.keys(this.labels).includes(id);
      const alreadyRetrievingLabel = this._labelsBeingCachedForIds.has(id);
      return !labelAlreadyDefined && !alreadyRetrievingLabel;
    });

    if (!idsWithoutLabel || idsWithoutLabel.length === 0) {
      return;
    }

    idsWithoutLabel.map((id) => {
      this._labelsBeingCachedForIds.add(id);

      // While loading, set label based on ID as a fallback (also in case no label is retrieved)
      const labelAlreadyDefined = id in this.labels;
      if (!labelAlreadyDefined) {
        this.labels[id] = replacePrefixes(id);
      }
    });

    // console.log('RETRIEVING LABELS BATCH', idsWithoutLabel);
    const idsAndLabels = await this.sparql.getLabels(idsWithoutLabel);
    // console.log('RETRIEVED LABELS BATCH', idsAndLabels);

    for (const idAndLabel of idsAndLabels) {
      const id = idAndLabel['@id'];
      this.labels[id] = idAndLabel.label;
      this._labelsBeingCachedForIds.delete(id);
    }
  }

  async cacheLabelForId(id: string): Promise<string> {
    if (!id) {
      return 'N/A';
    }
    this._idsToCacheLabelFor.add(id);

    return this.labels?.[id] ?? replacePrefixes(id);
  }
}
