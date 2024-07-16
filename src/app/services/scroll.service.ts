import { ElementRef, Injectable } from '@angular/core';
import { NodeService } from './node.service';
import { DetailsService } from './details.service';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private _scrollContainer: ElementRef | undefined;

  constructor(
    public nodes: NodeService,
    public details: DetailsService,
  ) {
    this.initScrollOnDetailsViewChange();
  }

  initScrollContainer(scrollContainer: ElementRef) {
    this._scrollContainer = scrollContainer;
  }

  initScrollOnDetailsViewChange() {
    this.details.showingDetailsForNodeId.subscribe((nodeId) => {
      const isShowingDetails = !!nodeId;
      if (isShowingDetails) {
        this.scrollToTop();
      } else {
        this.scrollToSearchResult();
      }
    });
  }

  scrollToTop() {
    // TODO: Properly wait for details page to have completed rendering instead of using timeout "hack"

    // TODO: Scroll to just below the filters?
    setTimeout(() => {
      if (!this._scrollContainer) {
        return;
      }
      this._scrollContainer.nativeElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 150);
  }

  scrollToSearchResult() {
    if (!this._scrollContainer) {
      return;
    }
    console.log('Scroll to search result', this._scrollContainer.nativeElement);
  }
}
