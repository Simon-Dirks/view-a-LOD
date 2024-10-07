import { Injectable } from '@angular/core';
import { NodeModel } from '../models/node.model';
import { NodeService } from './node.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  constructor(
    private nodes: NodeService,
    private router: Router,
  ) {}

  get isShowing(): boolean {
    return this.router.url.startsWith('/details');
  }

  getLink(node: NodeModel): string {
    const nodeId = this.nodes.getId(node);
    return '/details/' + encodeURIComponent(nodeId);
  }
}
