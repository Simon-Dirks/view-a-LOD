import { Component, Input } from '@angular/core';
import { Direction, NodeModel } from '../../../../../models/node.model';
import { NgForOf, NgIf } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { NodeLinkComponent } from '../../../../list-node/node-link/node-link.component';
import { NodeService } from '../../../../../services/node.service';

export enum TableCellShowOptions {
  Pred,
  Obj,
}

@Component({
  selector: 'app-node-table-cell',
  standalone: true,
  imports: [NgForOf, NgIcon, NgIf, NodeLinkComponent],
  templateUrl: './node-table-cell.component.html',
  styleUrl: './node-table-cell.component.scss',
})
export class NodeTableCellComponent {
  @Input() pred?: string;
  @Input() node?: NodeModel;
  @Input() direction?: Direction;
  @Input() show?: TableCellShowOptions;

  constructor(public nodes: NodeService) {}

  get isIncoming() {
    return this.direction === Direction.Incoming;
  }

  get objValues(): string[] {
    if (this.direction === undefined || !this.pred) {
      return [];
    }
    return this.nodes.getObjValuesByDirection(
      this.node,
      [this.pred],
      this.direction,
    );
  }

  protected readonly TableCellShowOptions = TableCellShowOptions;
}
