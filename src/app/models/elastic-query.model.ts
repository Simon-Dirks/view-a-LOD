export interface ElasticQueryModel {
  from: number;
  query: {
    simple_query_string: {
      query: string;
    };
  };
}
