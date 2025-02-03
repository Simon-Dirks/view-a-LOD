import { Component } from '@angular/core';
import { NodeRenderComponent } from '../../node-render.component';
import { JsonPipe, NgForOf } from '@angular/common';
import { ApiService } from '../../../../../services/api.service';
import { SparqlService } from '../../../../../services/sparql.service';
import { NodeService } from '../../../../../services/node.service';
import { labelPredicates } from '../../../../../config/settings';
import { NodeLinkComponent } from '../../../node-link/node-link.component';
import { wrapWithAngleBrackets } from '../../../../../helpers/util.helper';
import { EndpointService } from '../../../../../services/endpoint.service';
import { EndpointUrlsModel } from '../../../../../models/endpoint.model';

@Component({
  selector: 'app-hua-rubriek',
  standalone: true,
  imports: [JsonPipe, NodeLinkComponent, NgForOf],
  templateUrl: './hua-rubriek.component.html',
  styleUrl: './hua-rubriek.component.scss',
})
export class HuaRubriekComponent extends NodeRenderComponent {
  children: { subject: string; subjectLabel: string }[] = [];

  constructor(
    public api: ApiService,
    public sparql: SparqlService,
    public override nodes: NodeService,
    private endpointService: EndpointService,
  ) {
    super(nodes);
  }

  ngOnInit(): void {
    void this.initRubriek();
  }

  async initRubriek() {
    if (!this.node) {
      return;
    }

    const query = `
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix rico: <https://www.ica.org/standards/RiC/ontology#>
SELECT ?subject ?subjectLabel
WHERE {
  ?subject rico:isOrWasIncludedIn <${this.nodes.getId(this.node)}> .
  ?subject ${labelPredicates.map((p) => wrapWithAngleBrackets(p)).join('|')} ?subjectLabel .
}`;

    const endpointUrls: EndpointUrlsModel[] | null =
      this.endpointService.getEndpointUrls('hua');
    if (!endpointUrls) {
      return;
    }

    const response = await this.api.postData<
      { subject: string; subjectLabel: string }[]
    >(endpointUrls[0].sparql, {
      query: query,
    });

    if (!response || response.length === 0) {
      return;
    }

    this.children = response.sort((a, b) => {
      return ('' + a.subjectLabel).localeCompare(b.subjectLabel);
    });
  }
}
