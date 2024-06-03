import { Component } from '@angular/core';
import { FilterService } from '../../../services/search/filter.service';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../../node/node-link/node-link.component';
import { NgIcon } from '@ng-icons/core';
import { featherFilter, featherX } from '@ng-icons/feather-icons';
import { FilterType } from '../../../models/filter.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-active-filters',
  standalone: true,
  imports: [JsonPipe, NgForOf, NodeLinkComponent, NgIcon, NgIf, FormsModule],
  templateUrl: './active-filters.component.html',
  styleUrl: './active-filters.component.scss',
})
export class ActiveFiltersComponent {
  isShown: boolean = false;

  constructor(public filters: FilterService) {}

  protected readonly featherX = featherX;
  protected readonly featherFilter = featherFilter;
  protected readonly FilterType = FilterType;
}
