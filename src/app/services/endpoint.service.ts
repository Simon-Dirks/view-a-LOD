import { Injectable } from '@angular/core';
import { EndpointsModel, EndpointUrlsModel } from '../models/endpoint.model';
import { Settings } from '../config/settings';
import { BehaviorSubject } from 'rxjs';
import { SettingsService } from './settings.service';

@Injectable({
  providedIn: 'root',
})
export class EndpointService {
  enabledIds: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    Object.keys(Settings.endpoints),
  );

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

  isEnabled(endpointId: string) {
    return this.enabledIds.value.includes(endpointId);
  }

  getFirstUrls(): EndpointUrlsModel {
    return this.getAllUrls()[0];
  }

  getAllUrls(): EndpointUrlsModel[] {
    return Object.entries(Settings.endpoints as EndpointsModel)
      .filter(([endpointId, _]) => this.isEnabled(endpointId))
      .flatMap(([_, endpoint]) => endpoint.endpointUrls);
  }
}
