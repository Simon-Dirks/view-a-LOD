import { Injectable } from '@angular/core';
import { DetailsService } from './details.service';
import { FilterModel } from '../models/filter.model';
import { Config } from '../config/config';
import { FilterService } from './search/filter.service';
import { Router } from '@angular/router';
import { skip } from 'rxjs';
import { DataService } from './data.service';
import { EndpointService } from './endpoint.service';

@Injectable({
  providedIn: 'root',
})
export class UrlService {
  ignoreQueryParamChange = false;

  constructor(
    private details: DetailsService,
    private filters: FilterService,
    private router: Router,
    private data: DataService,
    private endpoints: EndpointService,
  ) {
    this._initUpdateUrlOnFilterChange();
    this._initUpdateUrlOnEndpointChange();
  }

  private _initUpdateUrlOnFilterChange() {
    // Skip URL change for initial (empty) enabled filters, as well as filters loaded from URL
    this.filters.enabled.pipe(skip(2)).subscribe((enabledFilters) => {
      void this.updateUrlToReflectFilters(enabledFilters);
    });

    this.filters.onlyShowResultsWithImages
      .pipe(skip(1))
      .subscribe(async (onlyWithImages) => {
        void this._updateUrlParam(
          Config.onlyWithImages,
          JSON.stringify(onlyWithImages),
        );
      });
  }

  private _initUpdateUrlOnEndpointChange() {
    this.endpoints.enabledIds
      .pipe(skip(1))
      .subscribe((endpointIds: string[]) => {
        void this._updateUrlToReflectEndpoints(endpointIds);
      });
  }

  private async _updateUrlToReflectEndpoints(endpointIds: string[]) {
    console.log('Updating URL to reflect endpoints', endpointIds);

    let endpointsParam: string | null = null;
    if (endpointIds && endpointIds.length > 0) {
      endpointsParam = endpointIds.join(',');
    }

    setTimeout(async () => {
      await this._updateUrlParam(Config.endpointsParam, endpointsParam);
    });
  }

  async updateUrlToReflectFilters(filters: FilterModel[]) {
    const enabledFiltersParam = JSON.stringify(
      this.data.convertFiltersToIdsFormat(filters),
    );

    console.log(
      'Updating URL to reflect filters',
      enabledFiltersParam.slice(0, 100) + '...',
      filters,
    );

    void this._updateUrlParam(Config.filtersParam, enabledFiltersParam);
  }

  private async _updateUrlParam(key: string, param: string | null) {
    this.ignoreQueryParamChange = true;
    await this.router.navigate([], {
      queryParams: { [key]: param },
      queryParamsHandling: 'merge',
    });
    this.ignoreQueryParamChange = false;
  }

  addParamToUrl(url: string, paramName: string, paramValue: string): string {
    try {
      const urlObj = new URL(url);
      urlObj.searchParams.set(paramName, paramValue);
      return urlObj.toString();
    } catch (error) {
      console.error('Invalid URL:', error);
      return url;
    }
  }

  processUrls(urls: string[], linkToDetails = true): string[] {
    return urls.map((url) => this.processUrl(url, linkToDetails));
  }

  processUrl(url: string, linkToDetails = true): string {
    if (linkToDetails) {
      return this.details.getLinkFromUrl(url);
    }

    if (url.includes('opslag.razu.nl')) {
      url = this.addParamToUrl(
        url,
        'token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTE3MDY0NjQsIm5iZiI6MTcxMTcwNjQ2NCwiZXhwIjoxNzQzMjQyNDY0fQ.ViNS0wWml0EwkF0z75G4cNZxKupYQMLiVB_PQ5kNQm8',
      );
    }

    url = url.replaceAll(
      'hetutrechtsarchief.nl/id',
      'hetutrechtsarchief.nl/collectie',
    );
    return url;
  }
}
