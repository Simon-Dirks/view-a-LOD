import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { NodeLinkComponent } from '../node-link/node-link.component';
import { EndpointService } from '../../../services/endpoint.service';

@Component({
  selector: 'app-node-endpoint',
  standalone: true,
  imports: [NgIf, NodeLinkComponent],
  templateUrl: './node-endpoint.component.html',
  styleUrl: './node-endpoint.component.scss',
})
export class NodeEndpointComponent {
  @Input() endpointId?: string;

  constructor(public endpoints: EndpointService) {}
}
