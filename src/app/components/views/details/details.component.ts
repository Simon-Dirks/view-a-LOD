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
import { ScrollService } from '../../../services/scroll.service';
import { DetailsBackButtonComponent } from '../../details-back-button/details-back-button.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NodeComponent, JsonPipe, NgIf, NgIcon, DetailsBackButtonComponent],
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
    public scroll: ScrollService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let nodeId = params.get('id');
      if (!nodeId) {
        return;
      }
      nodeId = decodeURIComponent(nodeId);

      // TODO: Move to service itself, instead of calling from component
      this.scroll.onNavigateToDetails(nodeId);
      void this.initNodeById(nodeId);
    });
  }

  async initNodeById(id: string) {
    this.node = undefined;
    this.nodeId = null;

    this.loadingNodeData = true;

    setTimeout(async () => {
      this.nodeId = id;
      const node = await this.sparql.getNode(this.nodeId);
      const enrichedNodes = await this.nodes.enrichWithIncomingRelations([
        node,
      ]);
      this.node = enrichedNodes[0] ?? node;
      this.loadingNodeData = false;
    });
  }

  protected readonly featherArrowLeft = featherArrowLeft;
}
