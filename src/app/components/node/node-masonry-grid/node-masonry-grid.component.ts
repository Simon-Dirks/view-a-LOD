import { Component, Input, OnInit } from '@angular/core';
import { ViewMode } from '../../../models/view-mode.enum';
import { NgxMasonryModule } from 'ngx-masonry';
import { NodeComponent } from '../node.component';
import { NgForOf, NgIf } from '@angular/common';
import { NodeModel } from '../../../models/node.model';

@Component({
  selector: 'app-node-masonry-grid',
  standalone: true,
  imports: [NgxMasonryModule, NodeComponent, NgForOf, NgIf],
  templateUrl: './node-masonry-grid.component.html',
  styleUrl: './node-masonry-grid.component.scss',
})
export class NodeMasonryGridComponent implements OnInit {
  @Input() nodes?: NodeModel[];

  updateMasonryLayoutTrigger = false;

  constructor() {}

  ngOnInit() {
    this.initMasonryLayoutUpdates();
  }

  initMasonryLayoutUpdates() {
    // TODO: Optimize if needed, fixes occasional layout errors after reactive component height changes
    setInterval(() => {
      this.updateMasonryLayout();
    }, 200);
  }

  updateMasonryLayout() {
    this.updateMasonryLayoutTrigger = true;
    setTimeout(() => {
      this.updateMasonryLayoutTrigger = false;
    }, 10);
  }

  get gridNodeWidthStr(): string {
    const columns = 2;
    return (100 / columns).toString() + '%';
  }
  protected readonly ViewMode = ViewMode;
}
