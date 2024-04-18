import { Component } from '@angular/core';
import { Direction, nodeObjValuesAsArray } from '../../../models/node.model';
import { replacePrefixes } from '../../../helpers/util.helper';
import { Settings } from '../../../config/settings';
import { JsonPipe, KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../../list-node/node-link/node-link.component';
import { NodeViewComponent } from '../node-view.component';
import { NgIcon } from '@ng-icons/core';

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
  protected readonly Settings = Settings;
  protected readonly Direction = Direction;
}
