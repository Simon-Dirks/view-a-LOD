export interface ElasticAggregationModel {
  buckets: DocCountModel[];
  sum_other_doc_count: number;
}

export interface DocCountModel {
  doc_count: number;
  key: string;
}
