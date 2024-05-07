import { Component, Input, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { NodeLinkComponent } from '../../node/node-link/node-link.component';
import { FilterService } from '../../../services/search/filter.service';
import { FilterModel, FilterType } from '../../../models/filter.model';

@Component({
  selector: 'app-filter-option',
  standalone: true,
  imports: [NgForOf, NodeLinkComponent],
  templateUrl: './filter-option.component.html',
  styleUrl: './filter-option.component.scss',
})
export class FilterOptionComponent implements OnInit {
  @Input() fieldIds?: string[];
  @Input() valueIds?: string[];

  constructor(public filterService: FilterService) {}

  ngOnInit() {}

  onFilterToggle(valueId: string) {
    if (!valueId || !this.fieldIds) {
      return;
    }

    const filters: FilterModel[] = this.fieldIds.map((fieldId) => {
      return {
        fieldId: fieldId,
        valueId: valueId,
        type: FilterType.FieldAndValue,
      };
    });

    this.filterService.toggleMultiple(filters);
  }

  protected readonly FilterType = FilterType;
}
