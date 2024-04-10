import { Component, Input } from '@angular/core';
import { NodeModel, nodeObjAsArray } from '../../../models/node.model';
import { replacePrefixes } from '../../../helpers/util.helper';
import { Settings } from '../../../config/settings';
import { KeyValuePipe, NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../node-link/node-link.component';

@Component({
  selector: 'app-node-relations-table',
  standalone: true,
  imports: [KeyValuePipe, NodeLinkComponent, NgForOf, NgIf],
  templateUrl: './node-relations-table.component.html',
  styleUrl: './node-relations-table.component.scss',
})
export class NodeRelationsTableComponent {
  @Input() node?: NodeModel;

  protected readonly nodeObjAsArray = nodeObjAsArray;
  protected readonly replacePrefixes = replacePrefixes;
  protected readonly Settings = Settings;
}
