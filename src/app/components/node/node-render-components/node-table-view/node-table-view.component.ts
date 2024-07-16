import { Component, OnInit } from '@angular/core';
import { JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../../node-link/node-link.component';
import { NodeRenderComponent } from '../node-render.component';
import { NgIcon } from '@ng-icons/core';
import { NodeTableComponent } from './node-table/node-table.component';
import { NodeService } from '../../../../services/node.service';
import { ViewMode } from '../../../../models/view-mode.enum';
import { SettingsService } from '../../../../services/settings.service';
import { ViewModeSetting } from '../../../../models/settings/view-mode-setting.enum';
import { featherChevronDown, featherChevronUp } from '@ng-icons/feather-icons';
import { PredicateVisibility } from '../../../../models/settings/predicate-visibility-settings.model';
import { DetailsService } from '../../../../services/details.service';

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
  canShowDetails = false;
  numOfDetailsPreds = 0;

  constructor(
    public settings: SettingsService,
    public override nodes: NodeService,
    public details: DetailsService,
  ) {
    super(nodes);
  }

  ngOnInit() {
    this.canShowDetails = this.settings.hasViewModeSetting(
      ViewModeSetting.ShowDetails,
    );
    this.numOfDetailsPreds = this._getNumOfPreds(PredicateVisibility.Details);
  }

  private _getNumOfPreds(visibility: PredicateVisibility): number {
    if (!this.node) {
      return 0;
    }

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
