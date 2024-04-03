import { Injectable } from '@angular/core';
import { NodeModel } from '../models/node.model';
import { Settings } from '../config/settings';
import { ApiService } from './api.service';
import { wrapWithAngleBrackets } from '../helpers/util.helper';
import { SparqlNodeParentModel } from '../models/sparql/sparql-node-parent';

@Injectable({
  providedIn: 'root',
})
export class SparqlService {
  constructor(private api: ApiService) {}

  async getAllParents(node: NodeModel): Promise<SparqlNodeParentModel[]> {
    if (!node || !node['@id']) {
      console.warn('No node to get parents for', node);
      return [];
    }
    const parentIris = Settings.predicates.parents.map((iri) =>
      wrapWithAngleBrackets(iri)
    );
    const titleIris = Settings.predicates.title.map((iri) =>
      wrapWithAngleBrackets(iri)
    );

    const query = `select distinct ?id ?title ?parent where {
  <${node['@id']}> ${parentIris.join('*|')}* ?id .
  OPTIONAL { ?id ${titleIris.join('|')} ?title . }
  OPTIONAL { ?id ${parentIris.join('|')} ?parent . }
}

limit 500`;

    return await this.api.postData(Settings.endpoints.sparql, { query: query });
  }
}
