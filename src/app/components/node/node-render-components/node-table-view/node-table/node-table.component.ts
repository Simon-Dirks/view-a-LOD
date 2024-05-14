import { Component, Input, OnInit } from '@angular/core';
import { Direction, NodeModel } from '../../../../../models/node.model';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { NodeLinkComponent } from '../../../node-link/node-link.component';
import { NodeService } from '../../../../../services/node.service';
import {
  NodeTableCellComponent,
  TableCellShowOptions,
} from './node-table-cell/node-table-cell.component';
import { SettingsService } from '../../../../../services/settings.service';
import { PredicateVisibility } from '../../../../../models/settings/predicate-visibility-settings.model';
import { sortByArrayOrder } from '../../../../../helpers/util.helper';

@Component({
  selector: 'app-node-table',
  standalone: true,
  imports: [
    NgForOf,
    NgIcon,
    NgIf,
    NodeLinkComponent,
    NgClass,
    NodeTableCellComponent,
    JsonPipe,
  ],
  templateUrl: './node-table.component.html',
  styleUrl: './node-table.component.scss',
})
export class NodeTableComponent implements OnInit {
  @Input() node?: NodeModel;
  @Input() smallFontSize = false;
  @Input() visibility!: PredicateVisibility;

  nodePreds: string[] = [];
  predicateVisibilities: { [pred: string]: PredicateVisibility } = {};
  numPredValues: {
    [pred: string]: { [direction in Direction]: number };
  } = {};

  constructor(
    public nodes: NodeService,
    public settings: SettingsService,
  ) {}

  ngOnInit() {
    this.initPredData();
    this.initNodePreds();
  }

  initNodePreds() {
    if (!this.node) {
      return;
    }
    const nodePreds = Object.keys(this.node);
    const sortedNodePreds = sortByArrayOrder(
      nodePreds,
      this.settings.getVisiblePredicates()[this.visibility],
    );
    this.nodePreds = sortedNodePreds;
  }

  initPredData() {
    if (!this.node) {
      return;
    }
    for (const pred of Object.keys(this.node)) {
      this.predicateVisibilities[pred] =
        this.settings.getPredicateVisibility(pred);

      for (const direction of [Direction.Outgoing, Direction.Incoming]) {
        if (!this.numPredValues[pred]) {
          (this.numPredValues[pred] as any) = {};
        }
        this.numPredValues[pred][direction] =
          this.nodes.getObjValuesByDirection(
            this.node,
            [pred],
            direction,
          ).length;
      }
    }
  }

  getNumPredValues(pred: string, direction: Direction) {
    if (!pred || direction === undefined) {
      return 0;
    }

    return this.numPredValues[pred][direction];
  }

  protected readonly Direction = Direction;
  protected readonly Object = Object;
  protected readonly TableCellShowOptions = TableCellShowOptions;
}
