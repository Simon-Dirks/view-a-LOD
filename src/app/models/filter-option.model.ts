export interface FilterOptionsModel {
  [filterId: string]: FilterOptionModel;
}

export interface FilterOptionModel {
  label: string;
  fieldIds: string[];
  values: FilterOptionValueModel[];
}

export interface FilterOptionValueModel {
  ids: string[];
  label?: string;
  count: number;
}
