import { ThingWithLabelsModel } from './thing-with-label.model';

export interface AutocompleteOptionModel extends ThingWithLabelsModel {
  type: AutocompleteOptionType;
}

export enum AutocompleteOptionType {
  SearchTerm,
  Node,
}
