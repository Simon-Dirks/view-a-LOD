import { Component, Input, OnInit } from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NodeModel, NodeObj, nodeObjAsArray } from '../../models/node.model';
import { NodeService } from '../../services/node.service';
import { Settings } from '../../config/settings';
import { SparqlService } from '../../services/sparql.service';
import { SparqlNodeParentModel } from '../../models/sparql/sparql-node-parent';
import { DataService } from '../../services/data.service';
import { NodeBasicInfoModel } from '../../models/node-basic-info.model';
import { NodeHierarchyComponent } from '../node-hierarchy/node-hierarchy.component';
import { removePrefixes } from '../../helpers/util.helper';
import { NodeTypesComponent } from './node-types/node-types.component';

@Component({
  selector: 'app-list-node',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    NgForOf,
    NodeHierarchyComponent,
    NodeTypesComponent,
  ],
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
    public data: DataService,
  ) {}

  ngOnInit() {
    void this.retrieveParents();
  }

  get types(): string[] {
    const obj: NodeObj = this.nodes.getObj(this.node, Settings.predicates.type);
    return nodeObjAsArray(obj);
  }

  async retrieveParents() {
    if (!this.node) {
      return;
    }

    const response: SparqlNodeParentModel[] = await this.sparql.getAllParents(
      this.node,
    );

    this.parents = this.data.getOrderedParentsFromSparqlResults(
      this.node['@id'],
      response,
    );
  }

  protected readonly removePrefixes = removePrefixes;
}
