import { DocCountModel } from './elastic-aggregation.model';

export interface FieldDocCountsModel {
  [fieldId: string]: DocCountModel[];
}
