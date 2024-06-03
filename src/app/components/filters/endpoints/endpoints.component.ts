import { Component } from '@angular/core';
import { FilterOptionComponent } from '../filter-options/filter-option/filter-option.component';
import { JsonPipe, NgClass, NgForOf } from '@angular/common';
import { Settings } from '../../../config/settings';
import { NodeLinkComponent } from '../../node/node-link/node-link.component';
import { EndpointService } from '../../../services/endpoint.service';
import { FilterCountComponent } from '../filter-options/filter-count/filter-count.component';
import { FilterService } from '../../../services/search/filter.service';
import { SearchService } from '../../../services/search/search.service';

@Component({
  selector: 'app-endpoints',
  standalone: true,
  imports: [
    FilterOptionComponent,
    NgForOf,
    JsonPipe,
    NodeLinkComponent,
    FilterCountComponent,
    NgClass,
  ],
  templateUrl: './endpoints.component.html',
  styleUrl: './endpoints.component.scss',
})
export class EndpointsComponent {
  constructor(
    public endpoints: EndpointService,
    public filters: FilterService,
    public search: SearchService,
  ) {}

  protected readonly Settings = Settings;
  protected readonly Object = Object;
}
