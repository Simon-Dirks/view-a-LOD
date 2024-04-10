import { Component, Input } from '@angular/core';
import { NodeModel } from '../../models/node.model';

@Component({
  selector: 'app-node-view',
  standalone: true,
  imports: [],
  template: ``,
})
export class NodeViewComponent {
  @Input() node?: NodeModel;
}
