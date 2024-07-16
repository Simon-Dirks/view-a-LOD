import { Component, Input } from '@angular/core';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { Direction, NodeModel } from '../../../../../../models/node.model';
import { PredicateVisibility } from '../../../../../../models/settings/predicate-visibility-settings.model';
import { NodeService } from '../../../../../../services/node.service';
import { SettingsService } from '../../../../../../services/settings.service';
import { sortByArrayOrder } from '../../../../../../helpers/util.helper';
import {
  NodeTableCellComponent,
  TableCellShowOptions,
} from '../node-table-cell/node-table-cell.component';
import { NodeLinkComponent } from '../../../../node-link/node-link.component';

@Component({
  selector: 'app-node-direction-table',
  standalone: true,
  imports: [NgForOf, NgClass, NodeTableCellComponent, NgIf, NodeLinkComponent],
  templateUrl: './node-direction-table.component.html',
  styleUrl: './node-direction-table.component.scss',
})
export class NodeDirectionTableComponent {
  @Input() node?: NodeModel;
  @Input() visibility!: PredicateVisibility;
  @Input() direction!: Direction;

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

  hasPredsToShow(direction: Direction, visibility: PredicateVisibility) {
    return Object.entries(this.numPredValues).some(
      ([pred, numValuesByDirection]) => {
        return (
          this.predicateVisibilities[pred] === visibility &&
          numValuesByDirection[direction] > 0
        );
      },
    );
  }

  get smallFontSize(): boolean {
    return false;
    // return this.visibility === PredicateVisibility.Details;
  }

  protected readonly Direction = Direction;
  protected readonly TableCellShowOptions = TableCellShowOptions;
}
