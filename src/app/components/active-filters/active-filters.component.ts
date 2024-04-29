import { Component } from '@angular/core';
import { FilterService } from '../../services/search/filter.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-active-filters',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './active-filters.component.html',
  styleUrl: './active-filters.component.scss',
})
export class ActiveFiltersComponent {
  constructor(public filters: FilterService) {}
}
