import { Component, Input } from '@angular/core';
import { NodeModel } from '../../../models/node.model';
import { NodeService } from '../../../services/node.service';

@Component({
  selector: 'app-node-view',
  standalone: true,
  imports: [],
  template: ``,
})
export class NodeViewComponent {
  @Input() node?: NodeModel;

  constructor(public nodes: NodeService) {}
}
