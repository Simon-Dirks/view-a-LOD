import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HopLinkSettingsModel } from '../../../../../models/settings/hop-link-settings.model';
import { SparqlService } from '../../../../../services/sparql.service';

@Component({
  selector: 'app-hop-component',
  standalone: true,
  imports: [],
  template: ``,
})
export class HopComponent {
  @Input() id?: string;
  @Input() settings?: HopLinkSettingsModel;
  @Output() hopObjIdsRetrieved = new EventEmitter<string[]>();

  hopObjIds: string[] = [];
  loading = false;

  constructor(public sparql: SparqlService) {}

  ngOnInit() {
    void this.initObjIdsForHop();
  }

  async initObjIdsForHop() {
    if (!this.id || !this.settings?.preds) {
      return;
    }

    this.loading = true;
    this.hopObjIds = await this.sparql
      .getObjIds(this.id, this.settings?.preds)
      .finally(() => {
        this.loading = false;
      });

    this.hopObjIdsRetrieved.emit(this.hopObjIds);
  }

  get showHops(): boolean {
    if (!this.settings || this.settings.showHops === undefined) {
      return true;
    }
    return this.settings.showHops;
  }

  get hasHopHits(): boolean {
    return this.hopObjIds && this.hopObjIds.length > 0;
  }
}
