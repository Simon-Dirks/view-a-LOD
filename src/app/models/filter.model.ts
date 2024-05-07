export interface FilterModel {
  fieldId?: string;
  valueId?: string;
  type: FilterType;
}

export enum FilterType {
  Field,
  Value,
  FieldAndValue,
}
