import { ViewMode } from '../view-mode.enum';

export type PredicateVisibilitySettings = {
  [v in ViewMode]: PredicateVisibilityEntries;
};

export enum PredicateVisibility {
  Show,
  Details,
  Hide,
}

export type PredicateVisibilityEntries = {
  [v in PredicateVisibility]: string[];
};
