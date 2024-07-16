import { ViewMode } from '../models/view-mode.enum';
import { ViewModeSetting } from '../models/settings/view-mode-setting.enum';
import { PredicateVisibility } from '../models/settings/predicate-visibility-settings.model';
import { RenderMode } from '../models/settings/render-component-settings.type';
import { FilterModel } from '../models/filter.model';

export const imagePredicates: string[] = [
  'http://xmlns.com/foaf/0.1/depiction',
  // 'https://schema.org/thumbnail',
  'https://schema.org/image',
];

const typePredicates: string[] = [
  'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
  'https://www.ica.org/standards/RiC/ontology#hasRecordSetType',
  'https://schema.org/additionalType',
  'http://www.wikidata.org/entity/P31',
];

const parentPredicates: string[] = [
  'https://www.ica.org/standards/RiC/ontology#isOrWasIncludedIn',
  'https://schema.org/isPartOf',
  'https://schema.org/hadPrimarySource',
  'http://www.nationaalarchief.nl/mdto#isOnderdeelVan',
];

export const labelPredicates: string[] = [
  'http://www.w3.org/2000/01/rdf-schema#label',
  'https://schema.org/name',
  'https://www.ica.org/standards/RiC/ontology#title',
  'https://www.ica.org/standards/RiC/ontology#textualValue',
  'http://www.nationaalarchief.nl/mdto#naam',
  'http://www.nationaalarchief.nl/mdto#begripLabel',
  'http://www.nationaalarchief.nl/mdto#verwijzingNaam',
  'http://www.nationaalarchief.nl/mdto#identificatieKenmerk',
];

const hideFilterOptionValueIds = [
  'http://www.nationaalarchief.nl/mdto#ChecksumGegevens',
  'http://www.w3.org/ns/shacl#NodeShape',
  'http://www.w3.org/2002/07/owl#Ontology',
  'http://www.nationaalarchief.nl/mdto#begripBegrippenlijst',
  'http://www.nationaalarchief.nl/mdto#verwijzingIdentificatie',
  'http://www.nationaalarchief.nl/mdto#GerelateerdInformatieobjectGegevens',
  'http://www.nationaalarchief.nl/mdto#Object',
  'http://www.nationaalarchief.nl/mdto#DekkingInTijdGegevens',
  'http://www.nationaalarchief.nl/mdto#VerwijzingGegevens',
  'http://www.nationaalarchief.nl/mdto#BegripGegevens',
  'http://www.nationaalarchief.nl/mdto#IdentificatieGegevens',
  'https://creativecommons.org/ns#License',
  'https://hetutrechtsarchief.nl/def/Archiefeenheidsoort',
  'https://hetutrechtsarchief.nl/def/Catalogusnummer',
  'https://hetutrechtsarchief.nl/def/DossiernummerKvk',
  'https://hetutrechtsarchief.nl/def/Inventarisnummer',
  'https://hetutrechtsarchief.nl/def/Microfichenummer',
  'https://hetutrechtsarchief.nl/def/NegatiefNummers',
  'https://hetutrechtsarchief.nl/def/Opschrift',
  'https://hetutrechtsarchief.nl/def/OudeOrde',
  'https://hetutrechtsarchief.nl/def/OudNummer',
  'https://hetutrechtsarchief.nl/def/Provenance',
  'https://hetutrechtsarchief.nl/def/RegestNummer',
  'https://hetutrechtsarchief.nl/def/SoortNegatief',
  'https://hetutrechtsarchief.nl/def/Titel',
  'https://hetutrechtsarchief.nl/def/ToegangsCode',
  'https://hetutrechtsarchief.nl/id/aet/col',
  'https://hetutrechtsarchief.nl/id/aet/mtrl',
  'https://hetutrechtsarchief.nl/id/aet/ntni',
  'https://hetutrechtsarchief.nl/id/aet/rfco',
  'https://hetutrechtsarchief.nl/id/aet/rub',
  'https://hetutrechtsarchief.nl/id/aet/scnni',
  'https://hetutrechtsarchief.nl/id/aet/tscni',
  'https://hetutrechtsarchief.nl/id/aet/tsct',
  'https://schema.org/Collection',
  'https://schema.org/Comment',
  'https://schema.org/PropertyValue',
  'https://schema.org/Text',
  'https://w3id.org/pnv#PersonName',
  'https://www.ica.org/standards/RiC/ontology#Agent',
  'https://www.ica.org/standards/RiC/ontology#Date',
  'https://www.ica.org/standards/RiC/ontology#Event',
  'https://www.ica.org/standards/RiC/ontology#Extent',
  'https://www.ica.org/standards/RiC/ontology#Identifier',
  'https://www.ica.org/standards/RiC/ontology#Instantiation',
  'https://www.ica.org/standards/RiC/ontology#RecordSet',
  'https://www.ica.org/standards/RiC/ontology#Title',
  'https://www.ica.org/standards/RiC/vocabularies/recordSetTypes#File',
  'https://www.ica.org/standards/RiC/vocabularies/recordSetTypes#Fonds',
  'https://www.ica.org/standards/RiC/vocabularies/recordSetTypes#Series',
  'https://web.maisflexis.nl/rdf/RUB',
  'https://web.maisflexis.nl/rdf/DB',
  'https://web.maisflexis.nl/rdf/VB',
  'https://web.maisflexis.nl/rdf/ABK',
  'https://web.maisflexis.nl/rdf/HSK',
  'https://web.maisflexis.nl/rdf/INV',
  'https://web.maisflexis.nl/rdf/INL',
  'https://web.maisflexis.nl/rdf/EB',
  'http://dbpedia.org/ontology/Place',
];

const peopleFilterOptionValueIds = [
  'https://schema.org/Person',
  'https://data.cbg.nl/pico#PersonObservation',
  'http://xmlns.com/foaf/0.1/Agent',
  'http://www.nationaalarchief.nl/mdto#archiefvormer',
];

const filtersForEmptySearch: FilterModel[] = [
  // ...imagePredicates.map((imagePredicate) => {
  //   return {
  //     fieldId: imagePredicate,
  //     type: FilterType.Field,
  //   };
  // }),
  // {
  //   fieldId: 'http://www.nationaalarchief.nl/mdto#heeftRepresentatie',
  //   type: FilterType.Field,
  // },
];
//
// const filtersForEmptySearch = [
//   {
//     fieldId: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type',
//     valueId: 'https://schema.org/ArchiveComponent',
//     type: FilterType.FieldAndValue,
//   },
// ];

export const Settings = {
  endpoints: {
    hua: {
      label: 'Het Utrechts Archief',
      endpointUrls: [
        {
          elastic:
            'https://api.data.netwerkdigitaalerfgoed.nl/datasets/hetutrechtsarchief/Test-Amerongen/services/Zoeken/_search',
          sparql:
            'https://api.data.netwerkdigitaalerfgoed.nl/datasets/hetutrechtsarchief/Test-Amerongen/sparql',
        },
      ],
    },
    razu: {
      label: 'Regionaal Archief Zuid-Utrecht',
      endpointUrls: [
        {
          elastic:
            'https://data.razu.nl/_api/datasets/razu/PoCAmerongen2024/services/PoCAmerongen2024/_search',
          sparql:
            'https://api.data.razu.nl/datasets/razu/PoCAmerongen2024/sparql',
        },
        {
          sparql: 'https://api.data.razu.nl/datasets/gedeeld/actoren/sparql',
          elastic:
            'https://data.razu.nl/_api/datasets/gedeeld/actoren/services/actoren/_search',
        },
        {
          sparql: 'https://api.data.razu.nl/datasets/gedeeld/locaties/sparql',
          elastic:
            'https://api.data.razu.nl/datasets/gedeeld/locaties/services/locaties/_search',
        },
      ],
    },
    kasteelAmerongen: {
      label: 'Kasteel Amerongen',
      endpointUrls: [
        {
          elastic:
            'https://data.razu.nl/_api/datasets/Kasteel-Amerongen/PoC2024/services/PoC2024-SKA/_search',
          sparql:
            'https://api.data.razu.nl/datasets/Kasteel-Amerongen/PoC2024/sparql',
        },
      ],
    },
  },
  filtering: {
    showFilterPanel: true,
    minNumOfValuesForFilterOptionToAppear: 1,
    filterOptions: {
      type: {
        label: 'Soort',
        fieldIds: typePredicates,
        values: [],
        hideValueIds: [...hideFilterOptionValueIds],
      },
      parents: {
        label: 'Is onderdeel van',
        fieldIds: [
          ...parentPredicates,
          'https://hetutrechtsarchief.nl/def/isDescendentOf',
        ],
        values: [],
        hideValueIds: [...hideFilterOptionValueIds],
      },
      license: {
        label: 'Licentie',
        fieldIds: ['https://schema.org/license'],
        values: [],
      },
    },
  },
  clustering: {
    filterOptionValues: {
      images: {
        label: 'Beeldmateriaal',
        valueIds: [
          'https://schema.org/CreativeWork',
          'https://schema.org/Drawing',
          'https://schema.org/ImageObject',
          'https://schema.org/Map',
          'https://schema.org/Photograph',
          'https://schema.org/VideoObject',
        ],
      },
      archive: {
        label: 'Archieven',
        valueIds: [
          'https://data.cbg.nl/pico-terms#doopinschrijving',
          'https://data.cbg.nl/pico-terms#dtb_begraven',
          'https://data.cbg.nl/pico-terms#geboorteakte',
          'https://data.cbg.nl/pico-terms#huwelijksakte',
          'https://data.cbg.nl/pico-terms#naamsverbetering',
          'https://data.cbg.nl/pico-terms#notariele-akte',
          'https://data.cbg.nl/pico-terms#overlijdensakte',
          'https://data.cbg.nl/pico-terms#trouwinschrijving',
          'https://hetutrechtsarchief.nl/def/Transcriptie',
          'https://hetutrechtsarchief.nl/def/Vertaling',
          'https://hetutrechtsarchief.nl/id/aet/db',
          'https://hetutrechtsarchief.nl/id/aet/eb',
          'https://hetutrechtsarchief.nl/id/aet/geb',
          'https://hetutrechtsarchief.nl/id/aet/kvk',
          'https://hetutrechtsarchief.nl/id/aet/notakt',
          'https://hetutrechtsarchief.nl/id/aet/ove',
          'https://hetutrechtsarchief.nl/id/aet/tsc',
          'https://hetutrechtsarchief.nl/id/lst/35-codicil',
          'https://hetutrechtsarchief.nl/id/lst/35-ontzegeling',
          'https://hetutrechtsarchief.nl/id/lst/35-procuratie',
          'https://hetutrechtsarchief.nl/id/lst/35-verzegeling',
          'https://schema.org/ArchiveComponent',
          'https://schema.org/SheetMusic',
          'https://www.ica.org/standards/RiC/ontology#Record',
          'http://www.nationaalarchief.nl/mdto#Bestand',
          'http://www.nationaalarchief.nl/mdto#Informatieobject',
        ],
      },
      locations: {
        label: 'Locaties',
        valueIds: [
          'https://hetutrechtsarchief.nl/id/aet/bd',
          'https://schema.org/Place',
          'https://schema.org/PostalAddress',
          'https://www.ica.org/standards/RiC/ontology#Place',
          'http://www.nationaalarchief.nl/mdto#dekkingInRuimte',
          'http://www.opengis.net/ont/geosparql#Geometry',
        ],
      },
      publicDomain: {
        label: 'Publiek Domein',
        valueIds: [
          'https://hetutrechtsarchief.nl/id/630EAF2CCA826B2DE0534701000AE1E2',
          'https://hetutrechtsarchief.nl/id/609C5BCA906D4642E0534701000A17FD',
          'https://hetutrechtsarchief.nl/id/630EAF2CCA806B2DE0534701000AE1E2',
        ],
      },
      subject: {
        label: 'Onderwerpen',
        valueIds: [
          'http://www.w3.org/2004/02/skos/core#Concept',
          'https://hetutrechtsarchief.nl/def/trefwoord_tst_107',
          'https://hetutrechtsarchief.nl/id/aet/incat',
        ],
      },
      people: {
        label: 'Personen',
        valueIds: peopleFilterOptionValueIds,
      },
      publication: {
        label: 'Publicaties',
        valueIds: [
          'https://hetutrechtsarchief.nl/def/Band',
          'https://hetutrechtsarchief.nl/id/aet/hasc',
          'https://hetutrechtsarchief.nl/id/aet/jrg',
          'https://hetutrechtsarchief.nl/id/aet/krtp',
          'https://schema.org/Article',
          'https://schema.org/Book',
          'https://schema.org/BookSeries',
          'https://schema.org/CollectionPage',
          'https://schema.org/Manuscript',
          'https://schema.org/Newspaper',
          'https://schema.org/PublicationEvent',
        ],
      },
    },
    types: {
      recordSet: {
        label: 'RecordSet',
        valueIds: [
          'https://www.ica.org/standards/RiC/ontology#RecordSet',
          'https://www.ica.org/standards/RiC/vocabularies/recordSetTypes#File',
        ],
      },
    },
    archive: {},
  },
  search: {
    resultsPerPagePerEndpoint: 10,
  },
  labelMaxChars: 100,
  predicates: {
    parents: parentPredicates,
    label: labelPredicates,
    type: typePredicates,
    images: imagePredicates,
  },
  renderComponents: {
    [RenderMode.ByType]: {
      // 'https://schema.org/Photograph': { componentId: 'sdo-photograph' },
      'https://hetutrechtsarchief.nl/id/aet/scnni': {
        componentId: 'gescand-inventarisnummer',
      },
      'https://hetutrechtsarchief.nl/id/aet/rub': {
        componentId: 'hua-rubriek',
      },
    },
    [RenderMode.ByPredicate]: {
      'http://xmlns.com/foaf/0.1/depiction': {
        componentId: 'node-images',
      },
      'https://schema.org/thumbnail': {
        componentId: 'node-images',
      },
      // 'https://schema.org/contentLocation': {
      //   componentId: 'map-thumb',
      // },
      'http://www.w3.org/1999/02/22-rdf-syntax-ns#type': {
        componentId: 'node-type',
      },
      'https://www.ica.org/standards/RiC/ontology#hasRecordSetType': {
        componentId: 'node-type',
      },
      'https://schema.org/additionalType': {
        componentId: 'node-type',
      },
      'http://www.wikidata.org/entity/P31': {
        componentId: 'node-type',
      },
      'http://www.nationaalarchief.nl/mdto#omvang': {
        componentId: 'mdto-omvang',
      },
      'http://www.nationaalarchief.nl/mdto#betrokkene': {
        componentId: 'hop-link',
        hopLinkSettings: {
          preds: ['http://www.nationaalarchief.nl/mdto#Actor'],
        },
      },
      'http://www.nationaalarchief.nl/mdto#gerelateerdInformatieobject': {
        componentId: 'hop-link',
        hopLinkSettings: {
          preds: [
            'http://www.nationaalarchief.nl/mdto#gerelateerdInformatieobjectVerwijzing',
          ],
          showHops: false,
        },
      },
      'http://www.nationaalarchief.nl/mdto#heeftRepresentatie': {
        componentId: 'hop-image',
        hopLinkSettings: {
          preds: [
            'http://www.nationaalarchief.nl/mdto#identificatie',
            'http://www.nationaalarchief.nl/mdto#identificatieKenmerk',
            'http://www.nationaalarchief.nl/mdto#URLBestand',
          ],
        },
      },
      'http://www.w3.org/ns/prov#hadPrimarySource': {
        componentId: 'hop-image',
        hopLinkSettings: {
          preds: ['http://xmlns.com/foaf/0.1/depiction'],
          showOriginalLink: true,
        },
      },
      'http://www.nationaalarchief.nl/mdto#dekkingInTijd': {
        componentId: 'mdto-dekking-in-tijd',
      },
      'http://www.nationaalarchief.nl/mdto#URLBestand': {
        componentId: 'mdto-url-bestand',
      },
      'https://www.ica.org/standards/RiC/ontology#hasOrHadIdentifier': {
        componentId: 'rico-identifier',
      },
      'https://schema.org/identifier': {
        componentId: 'rico-identifier',
      },
    },
  },
  viewModes: {
    [ViewMode.List]: {
      [ViewModeSetting.ShowDetails]: true,
      [ViewModeSetting.ShowParents]: true,
      [ViewModeSetting.ShowTypes]: true,
      [ViewModeSetting.ShowTitle]: true,
      [ViewModeSetting.ShowImageNextToTable]: true,
    },
    [ViewMode.Grid]: {
      [ViewModeSetting.ShowTitle]: true,
      [ViewModeSetting.ShowDetails]: true,
      [ViewModeSetting.ShowTypes]: true,
      [ViewModeSetting.ShowImageNextToTable]: true,
    },
  },
  largeImageWidth: { search: '30%', details: '40%' },
  imageForWhenLoadingFails: '/assets/img/image-load-fail.png',
  predicateVisibility: {
    [ViewMode.List]: {
      [PredicateVisibility.Show]: [],
      [PredicateVisibility.Details]: [
        ...imagePredicates,
        'http://www.nationaalarchief.nl/mdto#naam',
        // ...typePredicates,
        'https://schema.org/author',
        'http://www.nationaalarchief.nl/mdto#omschrijving',
        'http://www.nationaalarchief.nl/mdto#dekkingInRuimte',
        'http://www.nationaalarchief.nl/mdto#dekkingInTijd',
        'http://www.nationaalarchief.nl/mdto#URLBestand',
        'http://www.nationaalarchief.nl/mdto#heeftRepresentatie',
        'https://www.ica.org/standards/RiC/ontology#expressedDateValue',
        'https://www.ica.org/standards/RiC/ontology#hasCreator',
        '*',
      ],
      [PredicateVisibility.Hide]: [...typePredicates],
    },
    [ViewMode.Grid]: {
      [PredicateVisibility.Show]: [],
      [PredicateVisibility.Details]: ['*'],
      [PredicateVisibility.Hide]: [],
    },
  },
  alwaysHidePredicates: [
    '@id',
    'endpointId',
    'http://www.nationaalarchief.nl/mdto#checksum',
    'http://www.nationaalarchief.nl/mdto#waardering',
    'https://schema.org/breadcrumb',
    'https://hetutrechtsarchief.nl/def/isDescendentOf',
    'https://hetutrechtsarchief.nl/def/isDescendantOf',
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
    'https://data.razu.nl/Kasteel-Amerongen/': 'ska:',
    'https://data.razu.nl/razu/': 'razu:',
    'https://www.ica.org/standards/RiC/vocabularies/recordSetTypes#':
      'ric-rst:',
    'https://data.cbg.nl/pico-terms#': 'picot:',
    'http://www.nationaalarchief.nl/mdto-shacl#': 'mdto-sh:',
    'http://www.w3.org/ns/shacl#': 'sh:',
  },
  filtersForEmptySearch: filtersForEmptySearch,
};
