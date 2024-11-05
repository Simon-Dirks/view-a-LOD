import { FilterOptionIdsModel } from '../filter-option.model';

export interface SortBoostModel {
  boost: number;
  filter: FilterOptionIdsModel;
}
