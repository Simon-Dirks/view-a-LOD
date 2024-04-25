import { Component, Input } from '@angular/core';
import { Direction, NodeModel } from '../../../../models/node.model';
import { PredicateVisibility } from '../../../../models/predicate-visibility.enum';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { NodeLinkComponent } from '../../../list-node/node-link/node-link.component';
import { NodeService } from '../../../../services/node.service';
import { Settings } from '../../../../config/settings';

@Component({
  selector: 'app-node-table',
  standalone: true,
  imports: [NgForOf, NgIcon, NgIf, NodeLinkComponent, NgClass],
  templateUrl: './node-table.component.html',
  styleUrl: './node-table.component.scss',
})
export class NodeTableComponent {
  @Input() node?: NodeModel;
  @Input() visibility?: PredicateVisibility;
  @Input() smallFontSize = false;

  constructor(public nodes: NodeService) {}

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

  protected readonly Direction = Direction;
  protected readonly PredicateVisibility = PredicateVisibility;
  protected readonly Object = Object;
}
