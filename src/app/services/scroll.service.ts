import { ElementRef, Injectable } from '@angular/core';
import { NodeService } from './node.service';
import { DetailsService } from './details.service';

@Injectable({
  providedIn: 'root',
})
export class ScrollService {
  private _scrollContainer: ElementRef | undefined;

  private _lastClickedScrollId: string | null = null;
  public setLastClickedScrollId(scrollId: string) {
    this._lastClickedScrollId = scrollId;
  }

  private _scrollIdToReturnTo: string | null = null;

  constructor(
    public nodes: NodeService,
    public details: DetailsService,
  ) {
    this._initScrollOnDetailsViewChange();
  }

  initScrollContainer(scrollContainer: ElementRef) {
    this._scrollContainer = scrollContainer;
  }

  private _initScrollOnDetailsViewChange() {
    this.details.showing.subscribe((isShowing) => {
      if (!isShowing) {
        this.scrollToSearchResult();
      }
    });
  }

  onNavigateToDetails(nodeId: string) {
    if (this._lastClickedScrollId) {
      this._scrollIdToReturnTo = this._lastClickedScrollId;
      this._lastClickedScrollId = null;
    } else {
      this._scrollIdToReturnTo = encodeURIComponent(nodeId);
    }
  }

  scrollToSearchResult() {
    const idToScrollTo = this._scrollIdToReturnTo;
    // TODO: Properly wait for search results page to have completed rendering instead of using timeout "hack"
    //  Note that search results remain in the DOM when going to the details view (but invisible), therefore are not reloaded asynchronously anymore, drastically reducing the time we need to wait before initiating scroll
    setTimeout(() => {
      if (!this._scrollContainer || !idToScrollTo) {
        return;
      }

      const searchResultElem = document.querySelector(
        `[data-scroll-id="${idToScrollTo}"]`,
      );

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
    }, 10);
  }
}
