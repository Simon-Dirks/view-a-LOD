import { Component, OnInit } from '@angular/core';
import { JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../../node/node-link/node-link.component';
import { NodeViewComponent } from '../node-view.component';
import { NgIcon } from '@ng-icons/core';
import { PredicateVisibility } from '../../../models/predicate-visibility.enum';
import { NodeTableComponent } from './node-table/node-table.component';
import { NodeService } from '../../../services/node.service';
import { ViewMode } from '../../../models/view-mode.enum';
import { SettingsService } from '../../../services/settings.service';
import { ViewModeSetting } from '../../../models/view-mode-setting.enum';
import { ViewModeService } from '../../../services/view-mode.service';

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
    public viewModes: ViewModeService,
    public override nodes: NodeService,
  ) {
    super(nodes);
  }

  ngOnInit() {}

  getNumOfVisiblePreds(visibility: PredicateVisibility): number {
    if (!this.node) {
      return 0;
    }

    // TODO: Optimize (duplicate call given that table component checks getVisibility for each pred)
    const visiblePreds = Object.keys(
      Object.entries(this.node).filter(([pred, _]) => {
        const shouldShowAllPredicates = this.settings.predicateIsVisible(
          '*',
          visibility,
        );
        if (shouldShowAllPredicates) {
          return true;
        }
        return this.settings.predicateIsVisible(pred, visibility);
      }),
    );
    return visiblePreds.length;
  }

  protected readonly PredicateVisibility = PredicateVisibility;
  protected readonly Object = Object;
  protected readonly ViewMode = ViewMode;
  protected readonly ViewModeSetting = ViewModeSetting;
}
