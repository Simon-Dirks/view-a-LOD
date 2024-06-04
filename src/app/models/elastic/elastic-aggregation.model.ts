export interface ElasticAggregationModel {
  buckets: DocCountModel[];
  sum_other_doc_count: number;
}

export interface DocCountModel {
  field_hits?: {
    hits?: {
      hits?: { _id: string }[];
    };
  };
  hitIds: string[];
  // doc_count: number;
  key: string;
}
