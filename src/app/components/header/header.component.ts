import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { featherSearch, featherX } from '@ng-icons/feather-icons';
import { NgIcon } from '@ng-icons/core';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { UrlService } from '../../services/url.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { LangSwitchComponent } from '../lang-switch/lang-switch.component';

export enum HeaderView {
  ShowingColofon,
  ShowingSearch,
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NgIcon,
    NgIf,
    TranslatePipe,
    NgClass,
    LangSwitchComponent,
    AsyncPipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() view: HeaderView = HeaderView.ShowingSearch;

  constructor(
    public router: Router,
    public url: UrlService,
    public translate: TranslateService,
  ) {}

  get buttonUrl() {
    if (this.view === HeaderView.ShowingSearch) {
      return 'colofon';
    }
    return '';
  }

  async onButtonClicked(url: string) {
    this.url.ignoreQueryParamChange = true;
    await this.router.navigateByUrl(url);
    this.url.ignoreQueryParamChange = false;
  }

  protected readonly featherSearch = featherSearch;
  protected readonly featherX = featherX;
  protected readonly HeaderView = HeaderView;
}
