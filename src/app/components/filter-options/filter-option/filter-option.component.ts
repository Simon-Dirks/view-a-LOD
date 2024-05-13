import { Component, Input, OnInit } from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../../node/node-link/node-link.component';
import { FilterService } from '../../../services/search/filter.service';
import { FilterModel, FilterType } from '../../../models/filter.model';
import { FilterOptionValueModel } from '../../../models/filter-option.model';

@Component({
  selector: 'app-filter-option',
  standalone: true,
  imports: [NgForOf, NodeLinkComponent, JsonPipe, NgIf],
  templateUrl: './filter-option.component.html',
  styleUrl: './filter-option.component.scss',
})
export class FilterOptionComponent implements OnInit {
  @Input() fieldIds?: string[];
  @Input() values?: FilterOptionValueModel[];

  constructor(public filterService: FilterService) {}

  ngOnInit() {}

  onFilterToggle(valueIds: string[]) {
    if (!valueIds || !this.fieldIds) {
      return;
    }

    const filters: FilterModel[] = this.fieldIds.flatMap((fieldId) => {
      return valueIds.map((valueId) => {
        return {
          fieldId: fieldId,
          valueId: valueId,
          type: FilterType.FieldAndValue,
        };
      });
    });

    this.filterService.toggleMultiple(filters);
  }

  protected readonly FilterType = FilterType;
}
