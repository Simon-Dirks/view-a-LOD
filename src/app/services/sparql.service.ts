import { Injectable } from '@angular/core';
import { NodeModel } from '../models/node.model';
import { Settings } from '../config/settings';
import { ApiService } from './api.service';
import { wrapWithAngleBrackets } from '../helpers/util.helper';
import { SparqlIncomingRelationModel } from '../models/sparql/sparql-incoming-relation.model';
import { SparqlNodeParentModel } from '../models/sparql/sparql-node-parent.model';
import { ThingWithLabelModel } from '../models/thing-with-label.model';
import { SettingsService } from './settings.service';
import { EndpointService } from './endpoint.service';
import { EndpointUrlsModel } from '../models/endpoint.model';

@Injectable({
  providedIn: 'root',
})
export class SparqlService {
  constructor(
    private api: ApiService,
    private settings: SettingsService,
    private endpoints: EndpointService,
  ) {}

  getFederatedQuery(
    queryTemplate: string,
    queryEndpoints?: EndpointUrlsModel[],
  ): string {
    const firstEndpoint = queryEndpoints
      ? queryEndpoints[0].sparql
      : this.endpoints.getFirstUrls().sparql;
    const firstServiceQuery = `
{
  SERVICE <${firstEndpoint}> {
      ${queryTemplate}
  }
}`;

    const unionEndpoints = queryEndpoints
      ? queryEndpoints.slice(1)
      : this.endpoints.getAllUrls().slice(1);
    const unionServiceQueries = unionEndpoints.map(
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
      node['@id'].length !== 0;
    if (!isValidNode) {
      throw new Error('Node without ID passed');
    }
  }

  private _ensureEndpointsExist(): void {
    if (Object.keys(Settings.endpoints).length === 0) {
      throw new Error('No endpoints defined');
    }
  }

  async getIncomingRelations(
    node: NodeModel,
  ): Promise<SparqlIncomingRelationModel[]> {
    this._ensureNodeHasId(node);
    this._ensureEndpointsExist();

    const incomingRelationsQueryTemplate = `?sub ?pred <${node['@id'][0].value}>`;
    const query = `
SELECT DISTINCT ?sub ?pred WHERE {
 ${this.getFederatedQuery(incomingRelationsQueryTemplate)}
}

limit 500`;

    return await this.api.postData<SparqlIncomingRelationModel[]>(
      this.endpoints.getFirstUrls().sparql,
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
    const labelIris = Settings.predicates.label.map((iri) =>
      wrapWithAngleBrackets(iri),
    );

    const parentQueryTemplate = `
    <${node['@id'][0].value}> ${parentIris.join('*|')}* ?id .
    OPTIONAL { ?id ${labelIris.join('|')} ?title . }
    OPTIONAL { ?id ${parentIris.join('|')} ?parent . }`;

    const query = `
SELECT DISTINCT ?id ?title ?parent WHERE {
  ${this.getFederatedQuery(parentQueryTemplate)}
}

limit 500`;

    return await this.api.postData<SparqlNodeParentModel[]>(
      this.endpoints.getFirstUrls().sparql,
      {
        query: query,
      },
    );
  }

  // async getLabelFromLiterals(id: string): Promise<string> {
  //   const literalLabelQueryTemplate = `
  //   <${id}> ?p ?o .
  //   FILTER(isLiteral(?o))
  //   BIND(str(?o) AS ?literalValue)`;
  //
  //   const query = `
  //   SELECT (GROUP_CONCAT(DISTINCT ?literalValue; separator=" ") AS ?label)
  //   WHERE {
  //     ${this._getFederatedQuery(literalLabelQueryTemplate)}
  //   }`;
  //
  //   const labels: { label: string }[] = await this.api.postData<
  //     { label: string }[]
  //   >(Settings.endpoints[0].sparql, {
  //     query: query,
  //   });
  //   if (!labels || labels.length === 0 || labels[0].label.length == 0) {
  //     return replacePrefixes(id);
  //   }
  //   return replacePrefixes(labels[0].label);
  // }

  //   async getRdfsLabel(id: string): Promise<string> {
  //     const labelQueryTemplate = `<${id}> <http://www.w3.org/2000/01/rdf-schema#label> ?label`;
  //
  //     const query = `
  // select distinct ?label where {
  //     ${this._getFederatedQuery(labelQueryTemplate)}
  // }
  // limit 1`;
  //
  //     const labels: { label: string }[] = await this.api.postData<
  //       { label: string }[]
  //     >(Settings.endpoints[0].sparql, {
  //       query: query,
  //     });
  //     if (!labels || labels.length === 0) {
  //       return this.getLabelFromLiterals(id);
  //       // return replacePrefixes(id);
  //     }
  //
  //     return replacePrefixes(labels[0].label);
  //   }

  async getLabels(ids: string[]): Promise<ThingWithLabelModel[]> {
    const idIrisStr = ids.map((id) => wrapWithAngleBrackets(id)).join('\n');
    const labelIrisStr = Settings.predicates.label
      .map((iri) => wrapWithAngleBrackets(iri))
      .join('|');
    const labelQueryTemplate = `
VALUES ?s {
  ${idIrisStr}
}
?s ${labelIrisStr} ?label .`;

    const query = `
SELECT DISTINCT ?s ?label WHERE {
    ${this.getFederatedQuery(labelQueryTemplate)}
}
LIMIT 10000`;

    const response: { s: string; label: string }[] = await this.api.postData<
      { s: string; label: string }[]
    >(this.endpoints.getFirstUrls().sparql, {
      query: query,
    });
    const labels: ThingWithLabelModel[] = response.map(({ s, label }) => {
      return { '@id': s, label: label };
    });

    return labels;

    // TODO: Bring back fallback label from literals functionality
    // if (!labels || labels.length === 0) {
    //   return this.getLabelFromLiterals(id);
    //   return replacePrefixes(id);
    // }
    //
    // return replacePrefixes(labels[0].label);
  }

  async getObjIds(id: string, preds: string[]): Promise<string[]> {
    const predsIrisStr = preds
      .map((pred) => wrapWithAngleBrackets(pred))
      .join('/');
    const queryTemplate = `${wrapWithAngleBrackets(id)} ${predsIrisStr} ?o .`;

    const query = `
SELECT DISTINCT ?o WHERE {
    ${this.getFederatedQuery(queryTemplate)}
}
LIMIT 10000`;

    const response: { o: string }[] = await this.api.postData<{ o: string }[]>(
      this.endpoints.getFirstUrls().sparql,
      {
        query: query,
      },
    );
    const objIds = response.map((item) => item.o);

    return objIds;
  }
}
