import { PredicateVisibility } from '../models/predicate-visibility.enum';
import { ViewMode } from '../models/view-mode.enum';
import { ViewModeSetting } from '../models/view-mode-setting.enum';
import { RenderMode } from '../models/settings/view-component-settings.type';

const showInDetailsView: string[] = [
  'http://www.nationaalarchief.nl/mdto#waardering',
  'https://www.ica.org/standards/RiC/ontology#hasRecordSetType',
  'https://www.ica.org/standards/RiC/ontology#hasAccumulator',
  'https://www.ica.org/standards/RiC/ontology#isAccumulatorOf',
  'https://schema.org/numberOfPages',
  'https://schema.org/size',
  'http://www.nationaalarchief.nl/mdto#archiefvormer',
  'http://www.nationaalarchief.nl/mdto#classificatie',
];

const imagePredicates: string[] = [
  'http://xmlns.com/foaf/0.1/depiction',
  'https://schema.org/thumbnail',
];

export const Settings = {
  defaultSearchQuery:
    "Lit. MIP Amerongen, geschiedenis en architectuur, p. 139-141. Foto nr 1 in een cassette met 30 foto's, samengesteld ter gelegenheid van de bouw van de vergaderzaal van het Lekdijkshuis (Keistraat 9) te Utrecht.",
  endpoints: [
    {
      elastic:
        'https://api.data.netwerkdigitaalerfgoed.nl/datasets/hetutrechtsarchief/Test-Amerongen/services/Zoeken/_search',
      sparql:
        'https://api.data.netwerkdigitaalerfgoed.nl/datasets/hetutrechtsarchief/Test-Amerongen/sparql',
    },
    {
      elastic:
        'https://test.data.razu.nl/_api/datasets/Kasteel-Amerongen/PoC/services/PoC-2/_search',
      sparql:
        'https://api.test.data.razu.nl/datasets/Kasteel-Amerongen/PoC/services/PoC/sparql',
    },
  ],
  search: {
    resultsPerPagePerEndpoint: 10,
  },
  predicates: {
    parents: [
      'https://www.ica.org/standards/RiC/ontology#isOrWasIncludedIn',
      'https://schema.org/isPartOf',
      'https://schema.org/hadPrimarySource',
      'http://www.nationaalarchief.nl/mdto#isOnderdeelVan',
    ],
    title: [
      'http://www.w3.org/2000/01/rdf-schema#label',
      'https://schema.org/name',
      'https://www.ica.org/standards/RiC/ontology#title',
      'https://www.ica.org/standards/RiC/ontology#textualValue',
      'http://www.nationaalarchief.nl/mdto#naam',
      'http://www.nationaalarchief.nl/mdto#begripLabel',
    ],
    type: [
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
      'https://schema.org/additionalType',
      'http://www.wikidata.org/entity/P31',
    ],
    images: imagePredicates,
  },
  renderComponents: {
    [RenderMode.ByType]: {
      'https://schema.org/Photograph': 'sdo-photograph',
    },
    [RenderMode.ByPredicate]: {
      'http://xmlns.com/foaf/0.1/depiction': 'node-images',
      'https://schema.org/contentLocation': 'map-thumb',
    },
  },
  viewModes: {
    [ViewMode.List]: {
      [ViewModeSetting.ShowDetails]: true,
      [ViewModeSetting.ShowParents]: true,
    },
    [ViewMode.Grid]: {
      [ViewModeSetting.ShowDetails]: false,
      [ViewModeSetting.ShowParents]: false,
    },
  },
  predicateVisibility: {
    [PredicateVisibility.ShowInListView]: {
      show: ['*'],
      hide: showInDetailsView,
    },
    [PredicateVisibility.ShowInGridView]: {
      show: [...imagePredicates],
      hide: [],
    },
    [PredicateVisibility.ShowInDetailView]: {
      show: showInDetailsView,
      hide: [],
    },
  },
  alwaysHidePredicates: [
    'https://www.ica.org/standards/RiC/ontology#conditionsOfAccess',
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
    'http://www.wikidata.org/prop/direct/': 'wdt:',
    'http://www.w3.org/ns/prov#': 'prov:',
    'https://data.cbg.nl/pico#': 'pico:',
    'https://w3id.org/pnv#': 'pnv:',
    'http://xmlns.com/foaf/0.1/': 'foaf:',
    'http://www.nationaalarchief.nl/mdto#': 'mdto:',
    'https://test.data.razu.nl/Kasteel-Amerongen/PoC/': 'PoC:',
    'https://test.data.razu.nl/razu/': 'razu:',
  },
};
