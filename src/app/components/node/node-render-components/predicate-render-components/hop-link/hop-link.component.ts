import { Component, Input, OnInit } from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { SparqlService } from '../../../../../services/sparql.service';
import { NodeLinkComponent } from '../../../node-link/node-link.component';
import { NgIcon } from '@ng-icons/core';
import { featherChevronRight } from '@ng-icons/feather-icons';
import { NodeLabelComponent } from '../../../node-label/node-label.component';
import { HopLinkSettingsModel } from '../../../../../models/settings/hop-link-settings.model';

@Component({
  selector: 'app-hop-link',
  standalone: true,
  imports: [
    NgIf,
    JsonPipe,
    NodeLinkComponent,
    NgForOf,
    NgIcon,
    NodeLabelComponent,
  ],
  templateUrl: './hop-link.component.html',
  styleUrl: './hop-link.component.scss',
})
export class HopLinkComponent implements OnInit {
  @Input() id?: string;
  @Input() settings?: HopLinkSettingsModel;

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
  }

  get showHops(): boolean {
    if (!this.settings || this.settings.showHops === undefined) {
      return true;
    }
    return this.settings.showHops;
  }

  protected readonly featherChevronRight = featherChevronRight;
}
