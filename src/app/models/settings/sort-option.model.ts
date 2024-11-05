import { SortOrder } from './sort-order.enum';
import { SortBoostModel } from './sort-boost.model';

export interface SortOptionModel {
  id?: string;
  fields: string[];
  label: string;
  order: SortOrder;
  boost?: { [id: string]: SortBoostModel };
}

export type SortOptionsModel = {
  [id: string]: SortOptionModel;
};
