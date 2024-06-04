export type ElasticMatchQueries = {
  match_phrase: { [fieldId: string]: string };
};

export type ElasticShouldMatchQueries = {
  bool: {
    should: ElasticMatchQueries[];
  };
};
