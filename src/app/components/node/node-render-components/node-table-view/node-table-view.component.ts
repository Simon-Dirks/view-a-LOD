import { Component, OnInit } from '@angular/core';
import { JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../../node-link/node-link.component';
import { NodeRenderComponent } from '../node-render.component';
import { NgIcon } from '@ng-icons/core';
import { NodeTableComponent } from './node-table/node-table.component';
import { NodeService } from '../../../../services/node.service';
import { ViewMode } from '../../../../models/view-mode.enum';
import { SettingsService } from '../../../../services/settings.service';
import { ViewModeSetting } from '../../../../models/view-mode-setting.enum';
import { ViewModeService } from '../../../../services/view-mode.service';
import { featherChevronDown, featherChevronUp } from '@ng-icons/feather-icons';
import { PredicateVisibility } from '../../../../models/predicate-visibility-settings.model';

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
  extends NodeRenderComponent
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

  getNumOfPreds(visibility: PredicateVisibility): number {
    if (!this.node) {
      return 0;
    }

    // TODO: Optimize (duplicate call given that table component checks getVisibility for each pred)
    const visiblePreds = Object.keys(
      Object.entries(this.node).filter(([pred, _]) => {
        return this.settings.getPredicateVisibility(pred) === visibility;
      }),
    );
    return visiblePreds.length;
  }

  protected readonly PredicateVisibility = PredicateVisibility;
  protected readonly Object = Object;
  protected readonly ViewMode = ViewMode;
  protected readonly ViewModeSetting = ViewModeSetting;
  protected readonly featherChevronDown = featherChevronDown;
  protected readonly featherChevronUp = featherChevronUp;
}
