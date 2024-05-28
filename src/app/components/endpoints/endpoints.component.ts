import { Component } from '@angular/core';
import { FilterOptionComponent } from '../filter-options/filter-option/filter-option.component';
import { JsonPipe, NgForOf } from '@angular/common';
import { Settings } from '../../config/settings';
import { NodeLinkComponent } from '../node/node-link/node-link.component';
import { EndpointService } from '../../services/endpoint.service';

@Component({
  selector: 'app-endpoints',
  standalone: true,
  imports: [FilterOptionComponent, NgForOf, JsonPipe, NodeLinkComponent],
  templateUrl: './endpoints.component.html',
  styleUrl: './endpoints.component.scss',
})
export class EndpointsComponent {
  constructor(public endpoints: EndpointService) {}

  protected readonly Settings = Settings;
  protected readonly Object = Object;
}
