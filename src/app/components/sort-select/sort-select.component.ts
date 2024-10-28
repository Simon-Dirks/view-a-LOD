import { Component } from '@angular/core';
import { featherChevronDown } from '@ng-icons/feather-icons';
import { NgIcon } from '@ng-icons/core';
import { Settings } from '../../config/settings';
import { NgForOf } from '@angular/common';
import { SortService } from '../../services/sort.service';
import { FilterCountComponent } from '../filters/filter-options/filter-count/filter-count.component';
import { FormsModule } from '@angular/forms';
import { FilterService } from '../../services/search/filter.service';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-sort-select',
  standalone: true,
  imports: [NgIcon, NgForOf, FilterCountComponent, FormsModule],
  templateUrl: './sort-select.component.html',
  styleUrl: './sort-select.component.scss',
})
export class SortSelectComponent {
  constructor(
    public sorting: SortService,
    public filters: FilterService,
    public ui: UiService,
  ) {}

  onChange(selectedId: string) {
    this.sorting.select(selectedId);
  }

  protected readonly featherChevronDown = featherChevronDown;
  protected readonly Settings = Settings;
  protected readonly Object = Object;
}
