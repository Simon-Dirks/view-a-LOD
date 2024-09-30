export type ElasticQuery = {
  query_string: {
    query: string;
    fields?: string[];
    boost?: number;
    analyzer?: string;
  };
};
