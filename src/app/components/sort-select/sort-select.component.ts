import { Component } from '@angular/core';
import { featherChevronDown } from '@ng-icons/feather-icons';
import { NgIcon } from '@ng-icons/core';
import { Settings } from '../../config/settings';
import { NgForOf } from '@angular/common';
import { SortService } from '../../services/sort.service';
import { FilterCountComponent } from '../filters/filter-options/filter-count/filter-count.component';

@Component({
  selector: 'app-sort-select',
  standalone: true,
  imports: [NgIcon, NgForOf, FilterCountComponent],
  templateUrl: './sort-select.component.html',
  styleUrl: './sort-select.component.scss',
})
export class SortSelectComponent {
  constructor(public sorting: SortService) {}
  protected readonly featherChevronDown = featherChevronDown;
  protected readonly Settings = Settings;

  onChange(selectedId: string) {
    this.sorting.select(selectedId);
  }

  protected readonly Object = Object;
}
