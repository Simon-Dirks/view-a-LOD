import { PredicateVisibility } from './predicate-visibility.enum';

export type PredicateVisibilitiesModel = {
  [p in PredicateVisibility]: string[];
};
