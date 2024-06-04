export interface FilterModel {
  filterId?: string;
  fieldId?: string;
  valueId?: string;
  type: FilterType;
}

export enum FilterType {
  Field,
  Value,
  FieldAndValue,
}
