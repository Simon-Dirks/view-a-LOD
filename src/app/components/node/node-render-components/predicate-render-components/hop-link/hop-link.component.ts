import { Component, Input, OnInit } from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { SparqlService } from '../../../../../services/sparql.service';
import { NodeLinkComponent } from '../../../node-link/node-link.component';
import { NgIcon } from '@ng-icons/core';
import {
  featherAlertCircle,
  featherAlertTriangle,
  featherArrowUpRight,
  featherChevronRight,
  featherLink,
} from '@ng-icons/feather-icons';
import { NodeLabelComponent } from '../../../node-label/node-label.component';

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
  @Input() hopPreds?: string[];
  hopObjIds: string[] = [];
  loading = false;

  constructor(public sparql: SparqlService) {}

  ngOnInit() {
    void this.initObjIdsForHop();
  }

  async initObjIdsForHop() {
    if (!this.id || !this.hopPreds) {
      return;
    }

    this.loading = true;
    this.hopObjIds = await this.sparql
      .getObjIds(this.id, this.hopPreds)
      .finally(() => {
        this.loading = false;
      });
  }

  protected readonly featherLink = featherLink;
  protected readonly featherAlertTriangle = featherAlertTriangle;
  protected readonly featherArrowUpRight = featherArrowUpRight;
  protected readonly featherAlertCircle = featherAlertCircle;
  protected readonly featherChevronRight = featherChevronRight;
}
