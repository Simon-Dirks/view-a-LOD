import { Component, Input, OnInit } from '@angular/core';
import { SparqlService } from '../../../../../services/sparql.service';
import {
  intersects,
  wrapWithAngleBrackets,
} from '../../../../../helpers/util.helper';
import { ApiService } from '../../../../../services/api.service';
import { Settings } from '../../../../../config/settings';
import { NodeLinkComponent } from '../../../node-link/node-link.component';
import { NodeImagesComponent } from '../../../node-images/node-images.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-rico-identifier',
  standalone: true,
  imports: [NodeLinkComponent, NodeImagesComponent, NgIf],
  templateUrl: './rico-identifier.component.html',
  styleUrl: './rico-identifier.component.scss',
})
export class RicoIdentifierComponent implements OnInit {
  @Input() id?: string;

  label?: string;

  constructor(
    public api: ApiService,
    public sparql: SparqlService,
  ) {}

  ngOnInit(): void {
    void this.initLabel();
  }

  async initLabel() {
    if (!this.id) {
      return;
    }

    const prefixes = {
      rico: 'https://www.ica.org/standards/RiC/ontology#',
      rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    };
    const queryTemplate = `
    ${wrapWithAngleBrackets(this.id)} <${prefixes.rico}hasIdentifierType>/<${prefixes.rdfs}label> ?typeLabel ; <${prefixes.rico}textualValue> ?value .`;

    const query = `
SELECT distinct ?typeLabel ?value WHERE {
${this.sparql.getFederatedQuery(queryTemplate, Settings.endpoints.hua.endpointUrls)}
} LIMIT 1`;

    const response = await this.api.postData<
      { typeLabel: string; value: string }[]
    >(Settings.endpoints.hua.endpointUrls[0].sparql, {
      query: query,
    });
    if (!response || response.length === 0) {
      return;
    }

    this.label = `${response[0].typeLabel} ${response[0].value}`;
  }
}
