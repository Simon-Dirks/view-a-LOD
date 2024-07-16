import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { featherSearch, featherX } from '@ng-icons/feather-icons';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';

export enum HeaderView {
  ShowingColofon,
  ShowingSearch,
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIcon, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() view: HeaderView = HeaderView.ShowingSearch;

  constructor(public router: Router) {}

  get buttonUrl() {
    if (this.view === HeaderView.ShowingSearch) {
      return 'colofon';
    }
    return '';
  }

  protected readonly featherSearch = featherSearch;
  protected readonly featherX = featherX;
  protected readonly HeaderView = HeaderView;
}
