import { Component, Input } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../node-link/node-link.component';
import { NodeTypeComponent } from './node-type/node-type.component';
import { ClusterService } from '../../../services/cluster.service';
import { Settings } from '../../../config/settings';
import { TypeModel } from '../../../models/type.model';

@Component({
  selector: 'app-node-types',
  standalone: true,
  imports: [NgForOf, NgIf, NodeLinkComponent, NodeTypeComponent],
  templateUrl: './node-types.component.html',
  styleUrl: './node-types.component.scss',
})
export class NodeTypesComponent {
  @Input() types?: TypeModel[];
  clusteredTypes: TypeModel[] = [];

  constructor(public clusters: ClusterService) {}

  ngOnInit() {
    this.initClusteredTypes();
  }

  initClusteredTypes() {
    if (!this.types) {
      return;
    }
    this.clusteredTypes = this.clusters.clusterTypes(
      this.types,
      Settings.clustering.types,
    );
  }
}
