import { Component, Input } from '@angular/core';
import { NodeBasicInfoModel } from '../../models/node-basic-info.model';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { removePrefixes, truncate } from '../../helpers/util.helper';
import { NodeService } from '../../services/node.service';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-node-hierarchy',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass, NgIcon],
  templateUrl: './node-hierarchy.component.html',
  styleUrl: './node-hierarchy.component.scss',
})
export class NodeHierarchyComponent {
  @Input() nodes: NodeBasicInfoModel[] = [];
  collapsed = true;

  constructor(public nodeService: NodeService) {}

  get hasNodes(): boolean {
    return this.nodes !== undefined && this.nodes.length > 0;
  }

  get showNodes(): boolean {
    return this.hasNodes && this.nodes.length > 1;
  }

  protected readonly removePrefix = removePrefixes;
  protected readonly truncate = truncate;
}
