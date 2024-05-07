export type ElasticSimpleQuery = {
  simple_query_string: {
    query: string;
    fields?: string[];
    boost?: number;
  };
};
