import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';

export type ElasticEndpointSearchResponse<T> = SearchResponse<T> & {
  endpointId: string;
};
