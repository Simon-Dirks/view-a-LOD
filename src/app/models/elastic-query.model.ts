export interface ElasticQueryModel {
  from: number;
  size: number;
  query: {
    simple_query_string: {
      query: string;
    };
  };
  aggs?: any; // TODO: Add type
}
