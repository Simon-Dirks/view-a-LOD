export interface FilterModel {
  id: string;
  type: FilterType;
}

export enum FilterType {
  Field,
  Value,
}
