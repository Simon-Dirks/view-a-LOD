import { PredicateVisibility } from './predicate-visibility.enum';

export type PredicateVisibilitySettings = {
  [v in PredicateVisibility]: PredicateVisibilityEntries;
};

export type PredicateVisibilityEntries = {
  show: string[];
  hide: string[];
};
