import { Component, OnInit } from '@angular/core';
import { Direction, nodeObjValuesAsArray } from '../../../models/node.model';
import { replacePrefixes } from '../../../helpers/util.helper';
import { JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../../list-node/node-link/node-link.component';
import { NodeViewComponent } from '../node-view.component';
import { NgIcon } from '@ng-icons/core';
import { PredicateVisibility } from '../../../models/predicate-visibility.enum';
import { Settings } from '../../../config/settings';

@Component({
  selector: 'app-node-table-view',
  standalone: true,
  imports: [KeyValuePipe, NodeLinkComponent, NgForOf, NgIf, JsonPipe, NgIcon],
  templateUrl: './node-table-view.component.html',
  styleUrl: './node-table-view.component.scss',
})
export class NodeTableViewComponent
  extends NodeViewComponent
  implements OnInit
{
  showingDetails = false;

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

    // TODO: Optimize (duplicate call given that component checks getVisibility for each pred)
    const visiblePreds = Object.keys(
      Object.entries(this.node).filter(([pred, obj]) => {
        return (Settings.predicateVisibility as any)[visibility]?.includes(
          pred,
        );
      }),
    );
    return visiblePreds.length;
  }

  getVisibility(predicateId: string): PredicateVisibility {
    // TODO: Optimize / reduce number of calls if necessary
    for (const visibility of [
      PredicateVisibility.ShowInDetailView,
      PredicateVisibility.NeverShow,
    ]) {
      const visibilityIsDefined = (Settings.predicateVisibility as any)[
        visibility
      ].includes(predicateId);
      if (visibilityIsDefined) {
        return visibility;
      }
    }

    return PredicateVisibility.AlwaysShow;
  }

  protected readonly PredicateVisibility = PredicateVisibility;
  protected readonly nodeObjAsArray = nodeObjValuesAsArray;
  protected readonly replacePrefixes = replacePrefixes;
  protected readonly Direction = Direction;
}
