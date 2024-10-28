import { Component, Input, OnInit } from '@angular/core';
import {
  AsyncPipe,
  JsonPipe,
  KeyValuePipe,
  Location,
  NgClass,
  NgForOf,
  NgIf,
} from '@angular/common';
import { Direction, NodeModel } from '../../models/node.model';
import { NodeService } from '../../services/node.service';
import { Settings } from '../../config/settings';
import { SparqlService } from '../../services/sparql.service';
import { DataService } from '../../services/data.service';
import { ThingWithLabelModel } from '../../models/thing-with-label.model';
import { NodeHierarchyComponent } from './node-hierarchy/node-hierarchy.component';
import { NodeTypesComponent } from './node-types/node-types.component';
import { NodeImagesComponent } from './node-images/node-images.component';
import { LabelsCacheService } from '../../services/cache/labels-cache.service';
import { NodeLinkComponent } from './node-link/node-link.component';
import { NodeRendererComponent } from './node-renderer/node-renderer.component';
import { SparqlNodeParentModel } from '../../models/sparql/sparql-node-parent.model';
import { SettingsService } from '../../services/settings.service';
import { ViewModeSetting } from '../../models/settings/view-mode-setting.enum';
import { TypeModel } from '../../models/type.model';
import { NodeEndpointComponent } from './node-endpoint/node-endpoint.component';
import { NodeTableRowComponent } from './node-table-row/node-table-row.component';
import {
  featherArrowLeft,
  featherArrowRight,
  featherChevronRight,
} from '@ng-icons/feather-icons';
import { NgIcon } from '@ng-icons/core';
import { DetailsService } from '../../services/details.service';
import { NodeDetailsButtonComponent } from './node-details-button/node-details-button.component';
import { NodePermalinkButtonComponent } from './node-permalink-button/node-permalink-button.component';
import { Router, RouterLink } from '@angular/router';
import { RoutingService } from '../../services/routing.service';

@Component({
  selector: 'app-node',
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
    NodeRendererComponent,
    NodeEndpointComponent,
    NodeTableRowComponent,
    NgClass,
    NgIcon,
    NodeDetailsButtonComponent,
    NodePermalinkButtonComponent,
    RouterLink,
  ],
  templateUrl: './node.component.html',
  styleUrl: './node.component.scss',
})
export class NodeComponent implements OnInit {
  @Input() node?: NodeModel;
  parents: ThingWithLabelModel[] = [];

  id?: string;
  title = '';
  types: TypeModel[] = [];
  images: string[] = [];

  showTitle = this.settings.hasViewModeSetting(ViewModeSetting.ShowTitle);
  showParents = this.settings.hasViewModeSetting(ViewModeSetting.ShowParents);
  showTypes = this.settings.hasViewModeSetting(ViewModeSetting.ShowTypes);
  showImageNextToTable = this.settings.hasViewModeSetting(
    ViewModeSetting.ShowImageNextToTable,
  );

  constructor(
    public nodes: NodeService,
    public sparql: SparqlService,
    public data: DataService,
    public cache: LabelsCacheService,
    public settings: SettingsService,
    public details: DetailsService,
    public router: Router,
    public routing: RoutingService,
    public location: Location,
  ) {}

  ngOnInit() {
    void this.retrieveParents();
    this.initTitle();
    this.initTypes();
    this.initImages();

    if (!this.node) {
      return;
    }

    this.id = this.nodes.getId(this.node);
  }

  initTitle() {
    const titles = this.nodes
      .getObjValues(this.node, Settings.predicates.label)
      .map((title) => title.trim());

    if (!titles || titles.length === 0) {
      return;
    }

    this.title = titles[0];
  }

  async getHopImageUrls(nodeId: string): Promise<string[]> {
    const hopImagePromises = Settings.predicates.hopImages.map(
      (hopImagePreds) => this.sparql.getObjIds(nodeId, hopImagePreds),
    );

    const hopImageUrls = await Promise.all(hopImagePromises);
    return hopImageUrls.flat();
  }

  async initImages() {
    if (!this.node) {
      return;
    }

    this.images = this.nodes.getObjValues(
      this.node,
      Settings.predicates.images,
      undefined,
      true,
    );

    const nodeId: string = this.nodes.getId(this.node);
    const hopImageUrls: string[] = await this.getHopImageUrls(nodeId);
    this.images.push(...hopImageUrls);
  }

  initTypes() {
    // TODO: Render incoming types in the table view?
    const types: TypeModel[] = this.nodes
      .getObjValues(this.node, Settings.predicates.type, Direction.Outgoing)
      .map((typeId) => {
        return { id: typeId };
      });

    types.forEach((type) => {
      void this.cache.cacheLabelForId(type.id);
    });

    this.types = types;
  }

  async retrieveParents() {
    if (!this.node) {
      return;
    }

    const response: SparqlNodeParentModel[] = await this.sparql.getAllParents(
      this.node,
    );

    this.parents = this.data.getOrderedParentsFromSparqlResults(
      this.nodes.getId(this.node),
      response,
    );
  }

  get imageWidth(): string {
    if (window.innerWidth < 640) {
      return '100%';
    }

    return this.details.showing.value
      ? Settings.largeImageWidth.details
      : Settings.largeImageWidth.search;
  }

  shouldShowImageNextToTable(): boolean {
    return this.showImageNextToTable && this.images && this.images.length > 0;
  }

  protected readonly Settings = Settings;
  protected readonly featherChevronRight = featherChevronRight;
  protected readonly featherArrowRight = featherArrowRight;
  protected readonly featherArrowLeft = featherArrowLeft;
  protected readonly encodeURIComponent = encodeURIComponent;
}
