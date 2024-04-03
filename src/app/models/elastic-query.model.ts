export interface ElasticQueryModel {
  query: {
    simple_query_string: {
      query: string;
    };
  };
}
