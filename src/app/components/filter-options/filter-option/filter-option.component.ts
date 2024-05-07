import { Component, Input, OnInit } from '@angular/core';
import { NgForOf } from '@angular/common';
import { NodeLinkComponent } from '../../node/node-link/node-link.component';
import { FilterService } from '../../../services/search/filter.service';
import { FilterType } from '../../../models/filter.model';

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

  constructor(public filters: FilterService) {}

  ngOnInit() {}

  onFilterToggle($event: MouseEvent, valueId: string) {
    // TODO: Filter on field and value combination
    if (!valueId || !this.fieldIds) {
      return;
    }

    for (const fieldId of this.fieldIds) {
      this.filters.toggle({
        fieldId: fieldId,
        valueId: valueId,
        type: FilterType.FieldAndValue,
      });
    }
  }

  protected readonly FilterType = FilterType;
}
