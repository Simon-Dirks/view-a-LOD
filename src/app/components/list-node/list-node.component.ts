import { Component, Input, OnInit } from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NodeModel, NodeObj } from '../../models/node.model';
import { NodeService } from '../../services/node.service';
import { Settings } from '../../config/settings';
import { SparqlService } from '../../services/sparql.service';
import { SparqlNodeParentModel } from '../../models/sparql/sparql-node-parent';
import { DataService } from '../../services/data.service';
import { NodeBasicInfoModel } from '../../models/node-basic-info.model';
import { NodeHierarchyComponent } from '../parents-breadcrumbs/node-hierarchy.component';

@Component({
  selector: 'app-list-node',
  standalone: true,
  imports: [JsonPipe, NgIf, NgForOf, NodeHierarchyComponent],
  templateUrl: './list-node.component.html',
  styleUrl: './list-node.component.scss',
})
export class ListNodeComponent implements OnInit {
  @Input() node?: NodeModel;
  parents: NodeBasicInfoModel[] = [];

  protected readonly Settings = Settings;

  constructor(
    public nodes: NodeService,
    public sparql: SparqlService,
    public data: DataService
  ) {}

  ngOnInit() {
    void this.retrieveParents();
  }

  get type(): NodeObj {
    return this.nodes.getObj(this.node, Settings.predicates.type, true);
  }

  async retrieveParents() {
    if (!this.node) {
      return;
    }

    const response: SparqlNodeParentModel[] = await this.sparql.getAllParents(
      this.node
    );

    this.parents = this.data.getOrderedParentsFromSparqlResults(
      this.node['@id'],
      response
    );
  }
}
