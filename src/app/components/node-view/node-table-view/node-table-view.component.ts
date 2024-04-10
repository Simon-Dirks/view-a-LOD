import { Component } from '@angular/core';
import { nodeObjAsArray } from '../../../models/node.model';
import { replacePrefixes } from '../../../helpers/util.helper';
import { Settings } from '../../../config/settings';
import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../../list-node/node-link/node-link.component';
import { NodeViewComponent } from '../node-view.component';

@Component({
  selector: 'app-node-table-view',
  standalone: true,
  imports: [KeyValuePipe, NodeLinkComponent, NgForOf, NgIf],
  templateUrl: './node-table-view.component.html',
  styleUrl: './node-table-view.component.scss',
})
export class NodeTableViewComponent extends NodeViewComponent {
  protected readonly nodeObjAsArray = nodeObjAsArray;
  protected readonly replacePrefixes = replacePrefixes;
  protected readonly Settings = Settings;
}
