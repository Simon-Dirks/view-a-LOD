import { Injectable } from '@angular/core';
import { ViewModeService } from './view-mode.service';
import { Settings } from '../config/settings';
import { ViewMode } from '../models/view-mode.enum';
import { ViewModeSettings } from '../models/view-mode-settings.type';
import { ViewModeSetting } from '../models/view-mode-setting.enum';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(public viewModes: ViewModeService) {}

  getViewModeSetting(viewModeSetting: ViewModeSetting): boolean {
    const currentViewMode: ViewMode = this.viewModes.current;
    if (currentViewMode === undefined) {
      return true;
    }
    const viewModeSettings = (Settings.viewModes as ViewModeSettings)[
      currentViewMode
    ];
    return viewModeSettings?.[viewModeSetting];
  }
}
