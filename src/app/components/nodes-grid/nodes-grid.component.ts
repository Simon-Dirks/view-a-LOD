import { Component, Input } from '@angular/core';
import { NodeModel } from '../../models/node.model';
import { NgForOf } from '@angular/common';
import { NgxMasonryModule } from 'ngx-masonry';
import { NodeComponent } from '../node/node.component';

@Component({
  selector: 'app-nodes-grid',
  standalone: true,
  imports: [NgForOf, NgxMasonryModule, NodeComponent],
  templateUrl: './nodes-grid.component.html',
  styleUrl: './nodes-grid.component.scss',
})
export class NodesGridComponent {
  @Input() nodes?: NodeModel[];
}
