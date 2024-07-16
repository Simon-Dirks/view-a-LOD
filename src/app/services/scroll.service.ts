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
    this.details.showingForNodeId.subscribe((nodeId) => {
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
      console.log('Scrolling to top');
      this._scrollContainer.nativeElement.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 150);
  }

  scrollToSearchResult() {
    const idToScrollTo = this.details.lastShownNodeId;
    // TODO: Properly wait for search results page to have completed rendering instead of using timeout "hack"
    //  This is a bit tricky because many components are rendered asynchronously, while often taking up considerable vertical space (e.g., the node-hierarchy component). You don't want to wait for all of these components to finish rendering, but you also don't want to scroll to the wrong place because the DOM changes after scroll.
    setTimeout(() => {
      if (!this._scrollContainer || !idToScrollTo) {
        return;
      }

      const searchResultElem = document.getElementById(idToScrollTo);

      if (!searchResultElem) {
        return;
      }
      console.log(
        'Scrolling back to search result',
        idToScrollTo,
        searchResultElem,
      );

      const containerTop =
        this._scrollContainer.nativeElement.getBoundingClientRect().top;
      const elementTop = searchResultElem.getBoundingClientRect().top;
      const offset = elementTop - containerTop;

      this._scrollContainer.nativeElement.scrollTo({
        top: this._scrollContainer.nativeElement.scrollTop + offset,
        behavior: 'smooth',
      });
    }, 300);
  }
}
