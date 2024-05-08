export interface FilterOptionsModel {
  [filterId: string]: FilterOptionModel;
}

export interface FilterOptionModel {
  label: string;
  fieldIds: string[];
  values: FilterOptionValueModel[];
}

export interface FilterOptionValueModel {
  id: string;
  count: number;
}
