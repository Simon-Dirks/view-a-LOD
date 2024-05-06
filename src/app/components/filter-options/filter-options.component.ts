import { Component } from '@angular/core';
import { FilterService } from '../../services/search/filter.service';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../node/node-link/node-link.component';
import { FilterOptionComponent } from './filter-option/filter-option.component';

@Component({
  selector: 'app-filter-options',
  standalone: true,
  imports: [NgIf, NgForOf, JsonPipe, NodeLinkComponent, FilterOptionComponent],
  templateUrl: './filter-options.component.html',
  styleUrl: './filter-options.component.scss',
})
export class FilterOptionsComponent {
  constructor(public filters: FilterService) {}

  protected readonly Object = Object;
}
