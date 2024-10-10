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

  // scrollToTop() {
  //   // TODO: Properly wait for details page to have completed rendering instead of using timeout "hack"
  //
  //   // TODO: Scroll to just below the filters?
  //   setTimeout(() => {
  //     if (!this._scrollContainer) {
  //       return;
  //     }
  //     console.log('Scrolling to top');
  //     this._scrollContainer.nativeElement.scrollTo({
  //       top: 0,
  //       behavior: 'smooth',
  //     });
  //   }, 150);
  // }
  //

  scrollToSearchResult() {
    const idToScrollTo = this.details.lastShownNodeId;
    // TODO: Properly wait for search results page to have completed rendering instead of using timeout "hack"
    //  Note that search results remain in the DOM when going to the details view (but invisible), therefore are not reloaded asynchronously anymore, drastically reducing the time we need to wait before initiating scroll
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
    }, 10);
  }
}
