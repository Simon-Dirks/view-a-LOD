import { Component, OnInit } from '@angular/core';
import { Direction } from '../../../models/node.model';
import { JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../../list-node/node-link/node-link.component';
import { NodeViewComponent } from '../node-view.component';
import { NgIcon } from '@ng-icons/core';
import { PredicateVisibility } from '../../../models/predicate-visibility.enum';
import { Settings } from '../../../config/settings';
import { NodeTableComponent } from './node-table/node-table.component';
import { NodeService } from '../../../services/node.service';
import { ViewMode } from '../../../models/view-mode.enum';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'app-node-table-view',
  standalone: true,
  imports: [
    KeyValuePipe,
    NodeLinkComponent,
    NgForOf,
    NgIf,
    JsonPipe,
    NgIcon,
    NodeTableComponent,
  ],
  templateUrl: './node-table-view.component.html',
  styleUrl: './node-table-view.component.scss',
})
export class NodeTableViewComponent
  extends NodeViewComponent
  implements OnInit
{
  showingDetails = false;

  constructor(
    public settings: SettingsService,
    public override nodes: NodeService,
  ) {
    super(nodes);
  }

  ngOnInit() {}

  getNumOfVisiblePreds(visibility: PredicateVisibility): number {
    if (!this.node) {
      return 0;
    }

    if (visibility === PredicateVisibility.AlwaysShow) {
      return (
        Object.keys(this.node).length -
        (this.getNumOfVisiblePreds(PredicateVisibility.ShowInDetailView) +
          this.getNumOfVisiblePreds(PredicateVisibility.NeverShow))
      );
    }

    // TODO: Optimize (duplicate call given that table component checks getVisibility for each pred)
    const visiblePreds = Object.keys(
      Object.entries(this.node).filter(([pred, obj]) => {
        return (Settings.predicateVisibility as any)[visibility]?.includes(
          pred,
        );
      }),
    );
    return visiblePreds.length;
  }

  protected readonly PredicateVisibility = PredicateVisibility;
  protected readonly Direction = Direction;
  protected readonly Object = Object;
  protected readonly ViewMode = ViewMode;
}
