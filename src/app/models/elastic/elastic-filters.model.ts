export type ElasticFiltersModel = { terms: { [filterKey: string]: string[] } };

export const NoElasticFilters: ElasticFiltersModel = {
  terms: {},
};
