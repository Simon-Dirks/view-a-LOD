import { ElasticMatchQueries } from './elastic-match-queries.type';
import { ElasticFieldExistsQuery } from './elastic-field-exists-query.type';
import { ElasticQuery } from './elastic-query.type';

export type ElasticShouldQueries = {
  bool: {
    should: (ElasticMatchQueries | ElasticFieldExistsQuery | ElasticQuery)[];
  };
};
