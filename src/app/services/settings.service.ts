import { Injectable } from '@angular/core';
import { ViewModeService } from './view-mode.service';
import { Settings } from '../config/settings';
import { ViewMode } from '../models/view-mode.enum';
import { ViewModeSettings } from '../models/view-mode-settings.type';
import { ViewModeSetting } from '../models/view-mode-setting.enum';
import {
  PredicateVisibility,
  PredicateVisibilityEntries,
  PredicateVisibilitySettings,
} from '../models/predicate-visibility-settings.model';

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
      if (
        predicateId ===
        'https://www.ica.org/standards/RiC/ontology#hasRecordSetType'
      ) {
        console.log(
          'SHOWING',
          shouldShowAllPredsNotShownInDetails,
          predIsShownInDetails,
          JSON.stringify(detailPreds),
        );
      }
      return PredicateVisibility.Show;
    }

    const shouldShowRemainingPredsInDetails = detailPreds.includes('*');
    const predIsAlreadyShown = showPreds.includes(predicateId);
    const shouldShowDetailPred = detailPreds.includes(predicateId);
    if (
      (shouldShowRemainingPredsInDetails && !predIsAlreadyShown) ||
      shouldShowDetailPred
    ) {
      if (
        predicateId ===
        'https://www.ica.org/standards/RiC/ontology#hasRecordSetType'
      ) {
        console.log('DETAILS');
      }
      return PredicateVisibility.Details;
    }

    return PredicateVisibility.Hide;
  }
}
