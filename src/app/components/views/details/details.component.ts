import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NodeComponent } from '../../node/node.component';
import { NodeService } from '../../../services/node.service';
import { NodeModel } from '../../../models/node.model';
import { JsonPipe, NgIf } from '@angular/common';
import { SparqlService } from '../../../services/sparql.service';
import { featherArrowLeft } from '@ng-icons/feather-icons';
import { NgIcon } from '@ng-icons/core';
import { RoutingService } from '../../../services/routing.service';
import { DetailsService } from '../../../services/details.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NodeComponent, JsonPipe, NgIf, NgIcon],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  nodeId: string | null = null;
  node?: NodeModel;

  loadingNodeData = false;

  constructor(
    private route: ActivatedRoute,
    public nodes: NodeService,
    public sparql: SparqlService,
    public routing: RoutingService,
    public details: DetailsService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let nodeId = params.get('id');
      if (!nodeId) {
        return;
      }
      nodeId = decodeURIComponent(nodeId);
      this.details.lastShownNodeId = nodeId;
      void this.initNodeById(nodeId);
    });
  }

  async initNodeById(id: string) {
    this.loadingNodeData = true;
    this.nodeId = id;
    const node = await this.sparql.getNode(this.nodeId);
    const enrichedNodes = await this.nodes.enrichWithIncomingRelations([node]);
    this.node = enrichedNodes[0] ?? node;
    this.loadingNodeData = false;
  }

  protected readonly featherArrowLeft = featherArrowLeft;
}
