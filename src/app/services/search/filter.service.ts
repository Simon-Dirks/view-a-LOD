import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterModel, FilterType } from '../../models/filter.model';
import {
  FilterOptionModel,
  FilterOptionsModel,
} from '../../models/filter-option.model';
import { Settings } from '../../config/settings';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  enabled: BehaviorSubject<FilterModel[]> = new BehaviorSubject<FilterModel[]>([
    // { id: 'https://schema.org/Photograph', type: FilterType.Value },
    // { id: 'http://xmlns.com/foaf/0.1/depiction', type: FilterType.Field },
    // { id: 'https://schema.org/thumbnail', type: FilterType.Field },
    // { id: 'https://schema.org/image', type: FilterType.Field },
  ]);
  options: BehaviorSubject<FilterOptionsModel> =
    new BehaviorSubject<FilterOptionsModel>({
      type: {
        label: 'Soort',
        fieldIds: Settings.predicates.type,
        valueIds: [
          'https://schema.org/Article',
          'https://schema.org/Photograph',
          'https://schema.org/Book',
        ],
      },
      parents: {
        label: 'Is onderdeel van',
        fieldIds: Settings.predicates.parents,
        valueIds: [
          'https://hetutrechtsarchief.nl/id/609C5B9970D04642E0534701000A17FD',
        ],
      },
    });

  constructor() {}

  toggleMultiple(filters: FilterModel[]) {
    const enabledFilters = this.enabled.value;
    for (const filter of filters) {
      const existingFilterIdx = enabledFilters.findIndex(
        (f) =>
          f.valueId === filter.valueId &&
          f.fieldId === filter.fieldId &&
          f.type === filter.type,
      );
      const filterAlreadyExists = existingFilterIdx > -1;
      if (filterAlreadyExists) {
        enabledFilters.splice(existingFilterIdx, 1);
      } else {
        enabledFilters.push(filter);
      }
    }

    this.enabled.next(enabledFilters);
  }

  toggle(filter: FilterModel) {
    this.toggleMultiple([filter]);
  }

  has(id: string, type: FilterType): boolean {
    // TODO: Reduce calls to this function if needed for performance reasons
    return (
      this.enabled.value.find((f) => f.valueId === id && f.type === type) !==
      undefined
    );
  }

  getOptionById(filterId: string): FilterOptionModel {
    return this.options.value?.[filterId];
  }
}
