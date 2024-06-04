export interface FilterOptionsModel {
  [filterId: string]: FilterOptionModel;
}

export interface FilterOptionModel {
  label: string;
  fieldIds: string[];
  values: FilterOptionValueModel[];
  hideValueIds?: string[];
  showOnlyValueIds?: string[];
}

export interface FilterOptionValueModel {
  ids: string[];
  label?: string;
  filterHitIds: string[];
}
