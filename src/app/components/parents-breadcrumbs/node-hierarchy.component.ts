import { Component, Input } from '@angular/core';
import { NodeBasicInfoModel } from '../../models/node-basic-info.model';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-node-hierarchy',
  standalone: true,
  imports: [NgForOf, NgIf],
  templateUrl: './node-hierarchy.component.html',
  styleUrl: './node-hierarchy.component.scss',
})
export class NodeHierarchyComponent {
  @Input() nodes: NodeBasicInfoModel[] = [];

  constructor() {}

  get hasNodes(): boolean {
    return this.nodes && this.nodes.length > 0;
  }

  get showNodes(): boolean {
    return this.hasNodes && this.nodes.length > 1;
  }
}
