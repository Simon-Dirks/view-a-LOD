import { SortOrder } from './sort-order.enum';

export interface SortOptionModel {
  id?: string;
  field: string;
  label: string;
  order: SortOrder;
}

export type SortOptionsModel = {
  [id: string]: SortOptionModel;
};
