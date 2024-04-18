import { Injectable } from '@angular/core';
import { NodeModel } from '../models/node.model';
import { Settings } from '../config/settings';
import { ApiService } from './api.service';
import { replacePrefixes, wrapWithAngleBrackets } from '../helpers/util.helper';
import { SparqlIncomingRelationModel } from '../models/sparql/sparql-incoming-relation.model';
import { SparqlNodeParentModel } from '../models/sparql/sparql-node-parent.model';

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

  private _ensureNodeHasId(node: NodeModel): void {
    const isValidNode =
      node !== undefined &&
      node['@id'] !== undefined &&
      node['@id'].value !== undefined;
    if (!isValidNode) {
      throw new Error('Node without ID passed');
    }
  }

  private _ensureEndpointsExist(): void {
    if (Settings.endpoints.length === 0) {
      throw new Error('No endpoints defined');
    }
  }

  async getIncomingRelations(
    node: NodeModel,
  ): Promise<SparqlIncomingRelationModel[]> {
    this._ensureNodeHasId(node);
    this._ensureEndpointsExist();

    const incomingRelationsQueryTemplate = `?sub ?pred <${node['@id'].value}>`;
    const query = `
SELECT DISTINCT ?sub ?pred WHERE {
 ${this._getFederatedQuery(incomingRelationsQueryTemplate)}
}

limit 500`;

    return await this.api.postData<SparqlIncomingRelationModel[]>(
      Settings.endpoints[0].sparql,
      {
        query: query,
      },
    );
  }

  async getAllParents(node: NodeModel): Promise<SparqlNodeParentModel[]> {
    this._ensureNodeHasId(node);
    this._ensureEndpointsExist();

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
