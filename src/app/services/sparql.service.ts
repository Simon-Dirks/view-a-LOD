import { Injectable } from '@angular/core';
import { NodeModel } from '../models/node.model';
import { Settings } from '../config/settings';
import { ApiService } from './api.service';
import { replacePrefixes, wrapWithAngleBrackets } from '../helpers/util.helper';
import { SparqlNodeParentModel } from '../models/sparql/sparql-node-parent';

@Injectable({
  providedIn: 'root',
})
export class SparqlService {
  constructor(private api: ApiService) {}

  private _getFederatedQuery(queryTemplate: string): string {
    const firstServiceQuery = `
{
  SERVICE <${Settings.endpoints[0].sparql}> {
      ${queryTemplate}
  }
}`;

    const unionServiceQueries = Settings.endpoints.slice(1).map(
      (endpoint) => `
UNION {
    SERVICE <${endpoint.sparql}> {
        ${queryTemplate}
    }
}`,
    );

    return `${firstServiceQuery}\n${unionServiceQueries.join('\n')}`;
  }

  async getAllParents(node: NodeModel): Promise<SparqlNodeParentModel[]> {
    if (!node || !node['@id'] || !node['@id'].value) {
      console.warn('No node to get parents for', node);
      return [];
    }

    if (Settings.endpoints.length === 0) {
      console.warn('No endpoints defined');
      return [];
    }

    const parentIris = Settings.predicates.parents.map((iri) =>
      wrapWithAngleBrackets(iri),
    );
    const titleIris = Settings.predicates.title.map((iri) =>
      wrapWithAngleBrackets(iri),
    );

    const parentQueryTemplate = `
    <${node['@id'].value}> ${parentIris.join('*|')}* ?id .
    OPTIONAL { ?id ${titleIris.join('|')} ?title . }
    OPTIONAL { ?id ${parentIris.join('|')} ?parent . }`;

    const query = `
SELECT DISTINCT ?id ?title ?parent WHERE {
  ${this._getFederatedQuery(parentQueryTemplate)}
}

limit 500`;

    return await this.api.postData<SparqlNodeParentModel[]>(
      Settings.endpoints[0].sparql,
      {
        query: query,
      },
    );
  }

  async getLabelFromLiterals(id: string): Promise<string> {
    const literalLabelQueryTemplate = `
    <${id}> ?p ?o .
    FILTER(isLiteral(?o))
    BIND(str(?o) AS ?literalValue)`;

    const query = `
    SELECT (GROUP_CONCAT(DISTINCT ?literalValue; separator=" ") AS ?label)
    WHERE {
      ${this._getFederatedQuery(literalLabelQueryTemplate)}
    }`;

    const labels: { label: string }[] = await this.api.postData<
      { label: string }[]
    >(Settings.endpoints[0].sparql, {
      query: query,
    });
    if (!labels || labels.length === 0 || labels[0].label.length == 0) {
      return replacePrefixes(id);
    }
    return replacePrefixes(labels[0].label);
  }

  async getRdfsLabel(id: string): Promise<string> {
    const labelQueryTemplate = `<${id}> <http://www.w3.org/2000/01/rdf-schema#label> ?label`;

    const query = `
select distinct ?label where {
    ${this._getFederatedQuery(labelQueryTemplate)}
}
limit 1`;

    const labels: { label: string }[] = await this.api.postData<
      { label: string }[]
    >(Settings.endpoints[0].sparql, {
      query: query,
    });
    if (!labels || labels.length === 0) {
      return this.getLabelFromLiterals(id);
      // return replacePrefixes(id);
    }

    return replacePrefixes(labels[0].label);
  }
}
