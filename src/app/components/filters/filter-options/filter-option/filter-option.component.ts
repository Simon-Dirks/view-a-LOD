import { Component, Input, OnInit } from '@angular/core';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../../../node/node-link/node-link.component';
import { FilterService } from '../../../../services/search/filter.service';
import { FilterModel, FilterType } from '../../../../models/filter.model';
import { FilterOptionValueModel } from '../../../../models/filter-option.model';
import { formatNumber } from '../../../../helpers/util.helper';
import { SearchService } from '../../../../services/search/search.service';
import { Config } from '../../../../config/config';

@Component({
  selector: 'app-filter-option',
  standalone: true,
  imports: [NgForOf, NodeLinkComponent, JsonPipe, NgIf, NgClass],
  templateUrl: './filter-option.component.html',
  styleUrl: './filter-option.component.scss',
})
export class FilterOptionComponent implements OnInit {
  @Input() fieldIds?: string[];
  @Input() values?: FilterOptionValueModel[];

  constructor(
    public filterService: FilterService,
    public search: SearchService,
  ) {}

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

  getFilterOptionCountStr(count: number): string {
    if (count >= Config.elasticTopHitsMax) {
      return ` (${Config.elasticTopHitsMax}+)`;
    }

    return ` (${count})`;
  }

  protected readonly FilterType = FilterType;
  protected readonly formatNumber = formatNumber;
}
