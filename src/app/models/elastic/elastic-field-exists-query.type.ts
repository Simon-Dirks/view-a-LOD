export type ElasticFieldExistsQuery = {
  exists: {
    field: string;
    boost?: number;
  };
};
