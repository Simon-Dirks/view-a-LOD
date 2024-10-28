import { Injectable } from '@angular/core';
import { ViewModeService } from './view-mode.service';
import { Settings } from '../config/settings';
import { ViewMode } from '../models/view-mode.enum';
import { ViewModeSettings } from '../models/settings/view-mode-settings.type';
import { ViewModeSetting } from '../models/settings/view-mode-setting.enum';
import {
  PredicateVisibility,
  PredicateVisibilityEntries,
  PredicateVisibilitySettings,
} from '../models/settings/predicate-visibility-settings.model';
import { FilterPanelLocation } from '../models/settings/filter-panel-location.enum';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  constructor(public viewModes: ViewModeService) {}

  showingFilterPanelOnSide(): boolean {
    return (
      Settings.filtering.filterPanelLocation == FilterPanelLocation.Left ||
      Settings.filtering.filterPanelLocation == FilterPanelLocation.Right
    );
  }

  hasViewModeSetting(viewModeSetting: ViewModeSetting): boolean {
    const currentViewMode: ViewMode = this.viewModes.current.value;
    if (currentViewMode === undefined) {
      return true;
    }
    const viewModeSettings = (Settings.viewModes as ViewModeSettings)[
      currentViewMode
    ];
    return viewModeSettings?.[viewModeSetting];
  }

  getVisiblePredicates(): PredicateVisibilityEntries {
    // TODO: Fix type issue
    return (
      Settings.predicateVisibility as unknown as PredicateVisibilitySettings
    )[this.viewModes.current.value];
  }

  getPredicateVisibility(predicateId: string): PredicateVisibility {
    if ((Settings.alwaysHidePredicates as string[]).includes(predicateId)) {
      return PredicateVisibility.Hide;
    }

    const visiblePredicates: PredicateVisibilityEntries =
      this.getVisiblePredicates();
    if (visiblePredicates[PredicateVisibility.Hide].includes(predicateId)) {
      return PredicateVisibility.Hide;
    }

    const showPreds = visiblePredicates[PredicateVisibility.Show];
    const detailPreds = visiblePredicates[PredicateVisibility.Details];

    const shouldShowAllPredsNotShownInDetails = showPreds.includes('*');
    const predIsShownInDetails = detailPreds.includes(predicateId);
    const shouldShowPred = showPreds.includes(predicateId);

    if (
      (shouldShowAllPredsNotShownInDetails && !predIsShownInDetails) ||
      shouldShowPred
    ) {
      return PredicateVisibility.Show;
    }

    const shouldShowRemainingPredsInDetails = detailPreds.includes('*');
    const predIsAlreadyShown = showPreds.includes(predicateId);
    const shouldShowDetailPred = detailPreds.includes(predicateId);
    if (
      (shouldShowRemainingPredsInDetails && !predIsAlreadyShown) ||
      shouldShowDetailPred
    ) {
      return PredicateVisibility.Details;
    }

    return PredicateVisibility.Hide;
  }
}
