export const Settings = {
  endpoints: {
    elastic:
      'https://api.data.netwerkdigitaalerfgoed.nl/datasets/hetutrechtsarchief/Test-Amerongen/services/Zoeken/_search',
    sparql:
      'https://api.data.netwerkdigitaalerfgoed.nl/datasets/hetutrechtsarchief/Test-Amerongen/sparql',
  },
  predicates: {
    parents: [
      'https://www.ica.org/standards/RiC/ontology#isOrWasIncludedIn',
      'https://schema.org/isPartOf',
    ],
    title: [
      'http://www.w3.org/2000/01/rdf-schema#label',
      'https://www.ica.org/standards/RiC/ontology#title',
      '@id',
    ],
    type: ['http://www.w3.org/1999/02/22-rdf-syntax-ns#type'],
  },
  prefixesToHide: [
    'https://www.ica.org/standards/RiC/ontology#',
    'https://hetutrechtsarchief.nl/def/',
    'https://schema.org/',
    'http://www.w3.org/2004/02/skos/core#',
    'https://hetutrechtsarchief.nl/id/',
  ],
};
