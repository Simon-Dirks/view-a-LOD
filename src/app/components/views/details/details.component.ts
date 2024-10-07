import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NodeComponent } from '../../node/node.component';
import { NodeService } from '../../../services/node.service';
import { NodeModel } from '../../../models/node.model';
import { JsonPipe, NgIf } from '@angular/common';
import { SparqlService } from '../../../services/sparql.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [NodeComponent, JsonPipe, NgIf],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
})
export class DetailsComponent {
  nodeId: string | null = null;
  node?: NodeModel;

  constructor(
    private route: ActivatedRoute,
    public nodes: NodeService,
    public sparql: SparqlService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      let nodeId = params.get('id');
      if (!nodeId) {
        return;
      }
      nodeId = decodeURIComponent(nodeId);
      void this.initNodeById(nodeId);
    });
  }

  async initNodeById(id: string) {
    this.nodeId = id;
    const node = await this.sparql.getNode(this.nodeId);
    const enrichedNodes = await this.nodes.enrichWithIncomingRelations([node]);
    if (!enrichedNodes || enrichedNodes.length === 0) {
      this.node = node;
      return;
    }
    this.node = enrichedNodes[0];
  }
}
