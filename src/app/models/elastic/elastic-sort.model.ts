export interface ElasticSortEntryModel {
  [fieldId: string]: {
    order: ElasticSortOrder;
    unmapped_type: string;
  };
}

export type ElasticSortOrder = 'asc' | 'desc';
