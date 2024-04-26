import { Component, Input } from '@angular/core';
import { Direction, NodeModel } from '../../../../models/node.model';
import { PredicateVisibility } from '../../../../models/predicate-visibility.enum';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { NodeLinkComponent } from '../../../list-node/node-link/node-link.component';
import { NodeService } from '../../../../services/node.service';
import {
  NodeTableCellComponent,
  TableCellShowOptions,
} from './node-table-cell/node-table-cell.component';
import { SettingsService } from '../../../../services/settings.service';

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
  @Input() visibility!: PredicateVisibility;
  @Input() smallFontSize = false;

  constructor(
    public nodes: NodeService,
    public settings: SettingsService,
  ) {}

  getVisibilities(predicateId: string): PredicateVisibility[] {
    // TODO: Optimize / reduce number of calls (if necessary)
    // TODO: Iterate over enum values dynamically
    const visibilities: PredicateVisibility[] = [];
    for (const visibility of [
      PredicateVisibility.ShowInListView,
      PredicateVisibility.ShowInGridView,
      PredicateVisibility.ShowInDetailView,
    ]) {
      const predIsVisible = this.settings.predicateIsVisible(
        predicateId,
        visibility,
      );
      if (predIsVisible) {
        visibilities.push(visibility);
      }
    }

    return visibilities;
  }

  protected readonly Direction = Direction;
  protected readonly PredicateVisibility = PredicateVisibility;
  protected readonly Object = Object;
  protected readonly TableCellShowOptions = TableCellShowOptions;
}
