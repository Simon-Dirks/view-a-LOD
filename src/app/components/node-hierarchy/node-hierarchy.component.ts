import { Component, Input } from '@angular/core';
import { ThingWithLabelModel } from '../../models/thing-with-label.model';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { replacePrefixes, truncate } from '../../helpers/util.helper';
import { NodeService } from '../../services/node.service';
import { NgIcon } from '@ng-icons/core';
import { Config } from '../../config/config';

@Component({
  selector: 'app-node-hierarchy',
  standalone: true,
  imports: [NgForOf, NgIf, NgClass, NgIcon],
  templateUrl: './node-hierarchy.component.html',
  styleUrl: './node-hierarchy.component.scss',
})
export class NodeHierarchyComponent {
  @Input() nodes: ThingWithLabelModel[] = [];
  collapsed = true;

  constructor(public nodeService: NodeService) {}

  get hasLoadedNodes(): boolean {
    return this.nodes !== undefined;
  }

  get showNodes(): boolean {
    return this.hasLoadedNodes && this.nodes.length > 0;
  }

  get allowExpand(): boolean {
    return (
      this.hasLoadedNodes && this.nodes.length >= Config.numParentsToAllowExpand
    );
  }

  protected readonly removePrefix = replacePrefixes;
  protected readonly truncate = truncate;
}