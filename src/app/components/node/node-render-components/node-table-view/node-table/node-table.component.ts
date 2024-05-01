import { Component, Input } from '@angular/core';
import { Direction, NodeModel } from '../../../../../models/node.model';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { NodeLinkComponent } from '../../../node-link/node-link.component';
import { NodeService } from '../../../../../services/node.service';
import {
  NodeTableCellComponent,
  TableCellShowOptions,
} from './node-table-cell/node-table-cell.component';
import { SettingsService } from '../../../../../services/settings.service';
import { PredicateVisibility } from '../../../../../models/settings/predicate-visibility-settings.model';

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
  ],
  templateUrl: './node-table.component.html',
  styleUrl: './node-table.component.scss',
})
export class NodeTableComponent {
  @Input() node?: NodeModel;
  @Input() smallFontSize = false;
  @Input() visibility!: PredicateVisibility;

  constructor(
    public nodes: NodeService,
    public settings: SettingsService,
  ) {}

  protected readonly Direction = Direction;
  protected readonly Object = Object;
  protected readonly TableCellShowOptions = TableCellShowOptions;
}
