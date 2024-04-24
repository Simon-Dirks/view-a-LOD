import { Component } from '@angular/core';
import { Direction, nodeObjValuesAsArray } from '../../../models/node.model';
import { replacePrefixes } from '../../../helpers/util.helper';
import { JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../../list-node/node-link/node-link.component';
import { NodeViewComponent } from '../node-view.component';
import { NgIcon } from '@ng-icons/core';
import { PredicateVisibility } from '../../../models/predicate-visibility.enum';
import { Settings } from '../../../config/settings';
import { PredicateVisibilitiesModel } from '../../../models/predicate-visibilities.model';

@Component({
  selector: 'app-node-table-view',
  standalone: true,
  imports: [KeyValuePipe, NodeLinkComponent, NgForOf, NgIf, JsonPipe, NgIcon],
  templateUrl: './node-table-view.component.html',
  styleUrl: './node-table-view.component.scss',
})
export class NodeTableViewComponent extends NodeViewComponent {
  protected readonly nodeObjAsArray = nodeObjValuesAsArray;
  protected readonly replacePrefixes = replacePrefixes;
  protected readonly Direction = Direction;

  getVisibility(predicateId: string): PredicateVisibility {
    // TODO: Iterate over enum options dynamically
    for (const visibility of [
      PredicateVisibility.AlwaysShow,
      PredicateVisibility.ShowInDetailView,
      PredicateVisibility.NeverShow,
    ]) {
      const visibilityIsDefined = (
        Settings.predicateVisibility as PredicateVisibilitiesModel
      )[visibility].includes(predicateId);
      if (visibilityIsDefined) {
        return visibility;
      }
    }

    return PredicateVisibility.AlwaysShow;
  }

  protected readonly PredicateVisibility = PredicateVisibility;
}
