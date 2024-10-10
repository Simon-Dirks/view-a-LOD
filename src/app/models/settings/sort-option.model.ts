export interface SortOptionModel {
  id?: string;
  field: string;
  label: string;
}

export type SortOptionsModel = {
  [id: string]: SortOptionModel;
};
