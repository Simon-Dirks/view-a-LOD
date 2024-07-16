import { Injectable } from '@angular/core';
import { SearchService } from './search/search.service';
import { NodeModel } from '../models/node.model';
import { BehaviorSubject } from 'rxjs';
import { NodeService } from './node.service';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  private _showingForNodeId: BehaviorSubject<string | undefined> =
    new BehaviorSubject<string | undefined>(undefined);
  showingForNodeId = this._showingForNodeId.asObservable();

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
    return !!this._showingForNodeId.value;
  }

  show(node: NodeModel) {
    const nodeId = this.nodes.getId(node);
    this._showingForNodeId.next(nodeId);
  }

  stopShowing() {
    this._showingForNodeId.next(undefined);
  }

  shouldShowNode(node: NodeModel | undefined): boolean {
    if (!node) {
      return false;
    }
    const showingDetailsForId = this._showingForNodeId.value;
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
    const showingDetailsForId = this._showingForNodeId.value;
    if (!showingDetailsForId) {
      return false;
    }
    return nodeId === this._showingForNodeId.value;
  }
}
