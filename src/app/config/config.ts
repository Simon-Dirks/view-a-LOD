export const Config = {
  minNumParentsToAllowTreeExpand: 3,
  numObjValuesToShowDefault: 5,
  additionalNumObjValuesToShowOnClick: 5,
  numFilterOptionsToShowDefault: 10,
  additionalFilterOptionsToShowOnClick: 10,
  labelFetchIntervalMs: 100, // There's a continuous loop in the cache service checking if there are new labels that need to be retrieved and cached
  maxNumOfFilterOptionsPerField: 30,
  maxImagesToShow: 10,
  elasticTopHitsMax: 100, // Max 100
  detailsUrl: 'details',
  searchParam: 'search',
  filtersParam: 'filters',
  endpointsParam: 'endpoints',
  onlyWithImages: 'onlyWithImages',
};
