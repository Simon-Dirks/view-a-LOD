export type ElasticMatchQueries = {
  match_phrase: { [fieldId: string]: { query: string; boost?: number } };
};
