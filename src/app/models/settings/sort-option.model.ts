import { SortOrder } from './sort-order.enum';

export interface SortOptionModel {
  id?: string;
  fields: string[];
  label: string;
  order: SortOrder;
}

export type SortOptionsModel = {
  [id: string]: SortOptionModel;
};
