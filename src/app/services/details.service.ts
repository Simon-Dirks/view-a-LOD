import { Injectable } from '@angular/core';
import { SearchService } from './search/search.service';
import { NodeModel } from '../models/node.model';
import { BehaviorSubject } from 'rxjs';
import { NodeService } from './node.service';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  showingDetailsForNodeId: BehaviorSubject<string | undefined> =
    new BehaviorSubject<string | undefined>(undefined);

  constructor(
    private search: SearchService,
    private nodes: NodeService,
  ) {
    this.initStopShowingDetailsOnSearchResultChanges();
  }

  initStopShowingDetailsOnSearchResultChanges() {
    this.search.results.subscribe(() => {
      this.stopShowing();
    });
  }

  get isShowing(): boolean {
    return !!this.showingDetailsForNodeId.value;
  }

  show(node: NodeModel) {
    const nodeId = this.nodes.getId(node);
    this.showingDetailsForNodeId.next(nodeId);
  }

  stopShowing() {
    this.showingDetailsForNodeId.next(undefined);
  }

  shouldShowNode(node: NodeModel | undefined): boolean {
    if (!node) {
      return false;
    }
    const showingDetailsForId = this.showingDetailsForNodeId.value;
    const shouldShowAllNodes = !showingDetailsForId;
    if (shouldShowAllNodes) {
      return true;
    }

    return this.showing(node);
  }

  showing(node: NodeModel | undefined): boolean {
    if (!node) {
      return false;
    }

    const nodeId = this.nodes.getId(node);
    const showingDetailsForId = this.showingDetailsForNodeId.value;
    if (!showingDetailsForId) {
      return false;
    }
    return nodeId === this.showingDetailsForNodeId.value;
  }
}
