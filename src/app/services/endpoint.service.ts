import { Injectable } from '@angular/core';
import {
  EndpointModel,
  EndpointsModel,
  EndpointUrlsModel,
} from '../models/endpoint.model';
import { Settings } from '../config/settings';
import { BehaviorSubject } from 'rxjs';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class EndpointService {
  enabledIds: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(public settings: SettingsService) {}

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
