import { Component, Input, OnInit } from '@angular/core';
import {
  AsyncPipe,
  JsonPipe,
  KeyValuePipe,
  NgForOf,
  NgIf,
} from '@angular/common';
import { NodeModel, nodeObjAsArray } from '../../models/node.model';
import { NodeService } from '../../services/node.service';
import { Settings } from '../../config/settings';
import { SparqlService } from '../../services/sparql.service';
import { SparqlNodeParentModel } from '../../models/sparql/sparql-node-parent';
import { DataService } from '../../services/data.service';
import { ThingWithLabelModel } from '../../models/thing-with-label.model';
import { NodeHierarchyComponent } from '../node-hierarchy/node-hierarchy.component';
import { NodeTypesComponent } from './node-types/node-types.component';
import { NodeImagesComponent } from './node-images/node-images.component';
import { CacheService } from '../../services/cache.service';
import {
  isValidHttpUrl,
  replacePrefixes,
  replacePrefixesArray,
} from '../../helpers/util.helper';
import { NodeLinkComponent } from './node-link/node-link.component';
import { NodeRelationsTableComponent } from './node-relations-table/node-relations-table.component';

@Component({
  selector: 'app-list-node',
  standalone: true,
  imports: [
    JsonPipe,
    NgIf,
    NgForOf,
    NodeHierarchyComponent,
    NodeTypesComponent,
    NodeImagesComponent,
    AsyncPipe,
    KeyValuePipe,
    NodeLinkComponent,
    NodeRelationsTableComponent,
  ],
  templateUrl: './list-node.component.html',
  styleUrl: './list-node.component.scss',
})
export class ListNodeComponent implements OnInit {
  @Input() node?: NodeModel;
  parents: ThingWithLabelModel[] = [];

  protected readonly Settings = Settings;

  constructor(
    public nodes: NodeService,
    public sparql: SparqlService,
    public data: DataService,
    public cache: CacheService,
  ) {}

  ngOnInit() {
    void this.retrieveParents();
  }

  get types() {
    const typeIds: string[] = this.nodes.getObjAsArray(
      this.node,
      Settings.predicates.type,
    );

    typeIds.forEach((typeId) => {
      void this.cache.cacheLabelForId(typeId);
    });

    return typeIds;
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

  protected readonly replacePrefixes = replacePrefixes;
  protected readonly nodeObjAsArray = nodeObjAsArray;
  protected readonly replacePrefixesArray = replacePrefixesArray;
  protected readonly isValidHttpUrl = isValidHttpUrl;
}
