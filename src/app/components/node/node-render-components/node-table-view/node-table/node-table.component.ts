import { Component, Input, OnInit } from '@angular/core';
import { Direction, NodeModel } from '../../../../../models/node.model';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { NodeLinkComponent } from '../../../node-link/node-link.component';
import { NodeTableCellComponent } from './node-table-cell/node-table-cell.component';
import { PredicateVisibility } from '../../../../../models/settings/predicate-visibility-settings.model';
import { NodeDirectionTableComponent } from './node-direction-table/node-direction-table.component';
import { NodeService } from '../../../../../services/node.service';

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
    NodeDirectionTableComponent,
  ],
  templateUrl: './node-table.component.html',
  styleUrl: './node-table.component.scss',
})
export class NodeTableComponent implements OnInit {
  @Input() node?: NodeModel;
  @Input() visibility!: PredicateVisibility;

  constructor(public nodes: NodeService) {}

  ngOnInit(): void {}

  protected readonly Direction = Direction;
}
