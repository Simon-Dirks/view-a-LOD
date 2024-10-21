import { Component, Input } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../node-link/node-link.component';
import { NodeTypeComponent } from './node-type/node-type.component';
import { ClusterService } from '../../../services/cluster.service';
import { Settings } from '../../../config/settings';
import { TypeModel } from '../../../models/type.model';
import { intersects } from '../../../helpers/util.helper';
import { ClusterValuesSettingsModel } from '../../../models/settings/cluster-values-settings.model';

@Component({
  selector: 'app-node-types',
  standalone: true,
  imports: [NgForOf, NgIf, NodeLinkComponent, NodeTypeComponent],
  templateUrl: './node-types.component.html',
  styleUrl: './node-types.component.scss',
})
export class NodeTypesComponent {
  @Input() types?: TypeModel[];
  typesClusteredInFilters: TypeModel[] = [];
  clusteredTypes: TypeModel[] = [];

  constructor(public clusters: ClusterService) {}

  ngOnInit() {
    this.initTypesClusteredInFilters();
    this.initClusteredTypes();
  }

  initTypesClusteredInFilters() {
    if (!this.types) {
      return;
    }

    this.typesClusteredInFilters = [];
    const typeIds = this.types.map((t) => t.id);

    for (const [clusterId, filterCluster] of Object.entries(
      Settings.clustering.filterOptionValues as ClusterValuesSettingsModel,
    )) {
      const typesAreClustered = intersects(typeIds, filterCluster.valueIds);
      if (typesAreClustered) {
        this.typesClusteredInFilters.push({
          id: clusterId,
          label: filterCluster.label,
        });
      }
    }
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
