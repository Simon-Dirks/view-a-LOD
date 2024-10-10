import { Injectable } from '@angular/core';
import { NodeModel } from '../models/node.model';
import { NodeService } from './node.service';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Config } from '../config/config';

@Injectable({
  providedIn: 'root',
})
export class DetailsService {
  showing: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  lastShownNodeId: string | null = null;

  constructor(
    private nodes: NodeService,
    private router: Router,
  ) {
    this._updateShowingOnRouteChange();
  }

  private _updateShowingOnRouteChange() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const isShowingDetails = event.url.startsWith(`/${Config.detailsUrl}`);
        const stateChanged = this.showing.value !== isShowingDetails;
        if (stateChanged) {
          this.showing.next(isShowingDetails);
        }
      }
    });
  }

  isShowing(): boolean {
    return this.router.url.startsWith(`/${Config.detailsUrl}`);
  }

  getLink(node: NodeModel): string {
    const nodeId = this.nodes.getId(node);
    return `/${Config.detailsUrl}/` + encodeURIComponent(nodeId);
  }
}
