export const Settings = {
  endpoints: {
    elastic:
      'https://api.data.netwerkdigitaalerfgoed.nl/datasets/hetutrechtsarchief/Test-Amerongen/services/Zoeken/_search',
    sparql:
      'https://api.data.netwerkdigitaalerfgoed.nl/datasets/hetutrechtsarchief/Test-Amerongen/sparql',
  },
  search: {
    resultsPerPage: 10,
  },
  predicates: {
    parents: [
      'https://www.ica.org/standards/RiC/ontology#isOrWasIncludedIn',
      'https://schema.org/isPartOf',
      'https://schema.org/hadPrimarySource',
    ],
    title: [
      'http://www.w3.org/2000/01/rdf-schema#label',
      'https://schema.org/name',
      'https://www.ica.org/standards/RiC/ontology#title',
      'https://www.ica.org/standards/RiC/ontology#textualValue',
      '@id',
    ],
    type: [
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      'https://schema.org/additionalType',
      'http://www.wikidata.org/entity/P31',
    ],
    images: [
      'http://xmlns.com/foaf/0.1/depiction',
      'https://schema.org/thumbnail',
    ],
  },
  views: {
    'https://schema.org/Article': 'sdo-article-view',
    'https://www.ica.org/standards/RiC/ontology#Record': 'rico-record-view',
  },
  hidePredicates: [
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
    'https://schema.org/additionalType',
    'http://www.wikidata.org/entity/P31',
    'http://www.w3.org/2000/01/rdf-schema#label',
    'https://schema.org/name',
    'https://www.ica.org/standards/RiC/ontology#title',
    'https://www.ica.org/standards/RiC/ontology#textualValue',
    'https://www.ica.org/standards/RiC/ontology#isOrWasIncludedIn',
    'https://www.ica.org/standards/RiC/ontology#hasOrHadIdentifier',
    'https://schema.org/isPartOf',
    'https://schema.org/identifier',
    'https://schema.org/hadPrimarySource',
    '@id',
  ],
  namespacePrefixes: {
    'https://www.ica.org/standards/RiC/ontology#': 'rico:',
    'https://hetutrechtsarchief.nl/def/': 'def:',
    'https://schema.org/': 'sdo:',
    'http://www.w3.org/2004/02/skos/core#': 'skos:',
    'https://hetutrechtsarchief.nl/id/': 'id:',
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#': 'rdf:',
    'http://www.w3.org/2000/01/rdf-schema#': 'rdfs:',
    'http://www.wikidata.org/entity/': 'wd:',
    'http://www.w3.org/ns/prov#': 'prov:',
    'https://data.cbg.nl/pico#': 'pico:',
    'https://w3id.org/pnv#': 'pnv:',
  },
};
