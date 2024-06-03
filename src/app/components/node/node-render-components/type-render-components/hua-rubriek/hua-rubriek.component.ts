import { Component } from '@angular/core';
import {NodeRenderComponent} from "../../node-render.component";
import {JsonPipe, NgForOf} from "@angular/common";
import {ApiService} from "../../../../../services/api.service";
import {SparqlService} from "../../../../../services/sparql.service";
import {NodeService} from "../../../../../services/node.service";
import {wrapWithAngleBrackets} from "../../../../../helpers/util.helper";
import {Settings} from "../../../../../config/settings";
import {NodeLinkComponent} from "../../../node-link/node-link.component";

@Component({
  selector: 'app-hua-rubriek',
  standalone: true,
  imports: [
    JsonPipe,
    NodeLinkComponent,
    NgForOf
  ],
  templateUrl: './hua-rubriek.component.html',
  styleUrl: './hua-rubriek.component.scss'
})
export class HuaRubriekComponent extends NodeRenderComponent {

  children: string[] = [];

  constructor(
    public api: ApiService,
    public sparql: SparqlService,
    public override nodes: NodeService,
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

    console.log("hoi");

    const query = `
prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
prefix rico: <https://www.ica.org/standards/RiC/ontology#>
SELECT ?subject
WHERE {
  ?subject rico:isOrWasIncludedIn <${this.nodes.getId(this.node)}> .
}`

    const response = await this.api.postData<
      { subject: string }[]
    >(Settings.endpoints.hua.endpointUrls[0].sparql, {
      query: query,
    });

    if (!response || response.length === 0) {
      return;
    }

    this.children = response.map((e)=>e.subject)
  }

}
