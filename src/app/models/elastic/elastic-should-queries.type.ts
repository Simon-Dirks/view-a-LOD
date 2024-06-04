import { ElasticMatchQueries } from './elastic-match-queries.type';
import { ElasticFieldExistsQuery } from './elastic-field-exists-query.type';
import { ElasticSimpleQuery } from './elastic-simple-query.type';

export type ElasticShouldQueries = {
  bool: {
    should: (
      | ElasticMatchQueries
      | ElasticFieldExistsQuery
      | ElasticSimpleQuery
    )[];
  };
};
