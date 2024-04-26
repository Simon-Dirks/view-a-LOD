import { Injectable } from '@angular/core';
import { ViewModeService } from './view-mode.service';
import { Settings } from '../config/settings';
import { ViewMode } from '../models/view-mode.enum';
import { ViewModeSettings } from '../models/view-mode-settings.type';
import { ViewModeSetting } from '../models/view-mode-setting.enum';
import {
  PredicateVisibilityEntries,
  PredicateVisibilitySettings,
} from '../models/predicate-visibility-settings.model';
import { PredicateVisibility } from '../models/predicate-visibility.enum';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(public viewModes: ViewModeService) {}

  getViewModeSetting(viewModeSetting: ViewModeSetting): boolean {
    const currentViewMode: ViewMode = this.viewModes.current.value;
    if (currentViewMode === undefined) {
      return true;
    }
    const viewModeSettings = (Settings.viewModes as ViewModeSettings)[
      currentViewMode
    ];
    return viewModeSettings?.[viewModeSetting];
  }

  getVisiblePredicates(
    visibility: PredicateVisibility,
  ): PredicateVisibilityEntries {
    return (Settings.predicateVisibility as PredicateVisibilitySettings)[
      visibility
    ];
  }

  predicateIsVisible(
    predicateId: string,
    visibility: PredicateVisibility,
  ): boolean {
    if (Settings.alwaysHidePredicates.includes(predicateId)) {
      return false;
    }

    const visiblePredicates: PredicateVisibilityEntries =
      this.getVisiblePredicates(visibility);
    if (visiblePredicates.hide.includes(predicateId)) {
      return false;
    }

    if (visiblePredicates.show.includes('*')) {
      return true;
    }
    return visiblePredicates.show.includes(predicateId);
  }
}
