import { Injectable } from '@angular/core';
import {
  EndpointModel,
  EndpointsModel,
  EndpointUrlsModel,
} from '../models/endpoint.model';
import { Settings } from '../config/settings';
import { BehaviorSubject, take } from 'rxjs';
import { SettingsService } from './settings.service';
import { Config } from '../config/config';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class EndpointService {
  enabledIds: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(
    public settings: SettingsService,
    private route: ActivatedRoute,
  ) {
    this._initUpdateEndpointsOnUrlChange();
  }

  private _initUpdateEndpointsOnUrlChange() {
    void this.route.queryParams.pipe(take(1)).subscribe((queryParams) => {
      const endpointsParam: string | undefined =
        queryParams[Config.endpointsParam];
      if (endpointsParam) {
        const endpointIds: string[] = endpointsParam.split(',');
        this.enabledIds.next(endpointIds);
      }
    });
  }

  getById(endpointId: string): EndpointModel | undefined {
    const endpoints = Settings.endpoints as EndpointsModel;
    return endpoints[endpointId] ?? undefined;
  }

  getIdBySparqlUrl(sparqlEndpointUrl: string): string {
    const endpoints = Settings.endpoints as EndpointsModel;

    for (const [endpointId, endpoint] of Object.entries(endpoints)) {
      const endpointMatchesUrl = endpoint.endpointUrls.some(
        (endpointUrl) => endpointUrl.sparql === sparqlEndpointUrl,
      );
      if (endpointMatchesUrl) {
        return endpointId;
      }
    }

    return '';
  }

  toggle(endpointId: string) {
    const enabledIds = this.enabledIds.value;
    const existingEndpointIdx = enabledIds.findIndex(
      (enabledEndpointId) => enabledEndpointId === endpointId,
    );
    const endpointIsAlreadyEnabled = existingEndpointIdx > -1;
    if (endpointIsAlreadyEnabled) {
      enabledIds.splice(existingEndpointIdx, 1);
    } else {
      enabledIds.push(endpointId);
    }
    this.enabledIds.next(enabledIds);
  }

  isEnabled(endpointId: string): boolean {
    return this.enabledIds.value.includes(endpointId);
  }

  getFirstUrls(): EndpointUrlsModel {
    return this.getAllUrls()[0];
  }

  getAll(): EndpointsModel {
    const all: [string, EndpointModel][] = Object.entries(
      Settings.endpoints as EndpointsModel,
    ).filter(([endpointId, _]) => {
      const noFilterEnabled =
        !this.enabledIds.value || this.enabledIds.value.length === 0;
      if (noFilterEnabled) {
        return true;
      }
      return this.isEnabled(endpointId);
    });

    return Object.fromEntries(all);
  }

  getAllUrls(): EndpointUrlsModel[] {
    const allUrls = Object.entries(this.getAll()).flatMap(
      ([endpointId, endpoint]) => {
        endpoint.endpointUrls.forEach((u) => (u.id = endpointId));
        return endpoint.endpointUrls;
      },
    );
    return allUrls;
  }
}
