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
  selector: 'app-mdto-url-bestand',
  standalone: true,
  imports: [NodeLinkComponent, NodeImagesComponent, NgIf],
  templateUrl: './mdto-url-bestand.component.html',
  styleUrl: './mdto-url-bestand.component.scss',
})
export class MdtoUrlBestandComponent implements OnInit {
  @Input() nodeId?: string;
  @Input() fileUrl?: string;
  fileFormats?: string[];

  // TODO: Add complete list here
  imgFileFormats: string[] = ['fmt/44', 'jpeg'];

  constructor(
    public api: ApiService,
    public sparql: SparqlService,
  ) {}

  ngOnInit() {
    void this.initFileFormat();
  }

  async initFileFormat() {
    if (!this.nodeId) {
      return;
    }

    const queryTemplate = `
${wrapWithAngleBrackets(this.nodeId)} <http://www.nationaalarchief.nl/mdto#bestandsformaat> ?b .
?b <http://www.nationaalarchief.nl/mdto#begripLabel> ?bestandsformaat .`;

    const query = `
SELECT ?bestandsformaat WHERE {
  ${this.sparql.getFederatedQuery(queryTemplate, [...Settings.endpoints.razu.endpointUrls, ...Settings.endpoints.kasteelAmerongen.endpointUrls])}
} LIMIT 100`;

    const response = await this.api.postData<{ bestandsformaat: string }[]>(
      Settings.endpoints.razu.endpointUrls[0].sparql,
      {
        query: query,
      },
    );
    if (!response) {
      return;
    }
    this.fileFormats = response.map((r) => r.bestandsformaat);
  }

  get isImage(): boolean {
    if (!this.fileFormats) {
      return false;
    }
    return intersects(this.imgFileFormats, this.fileFormats);
  }
}
