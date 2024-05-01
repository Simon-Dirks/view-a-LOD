import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterModel, FilterType } from '../../models/filter.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  all: BehaviorSubject<FilterModel[]> = new BehaviorSubject<FilterModel[]>([
    // { id: 'https://schema.org/Photograph', type: FilterType.Value },
    // { id: 'http://xmlns.com/foaf/0.1/depiction', type: FilterType.Field },
    // { id: 'https://schema.org/thumbnail', type: FilterType.Field },
    // { id: 'https://schema.org/image', type: FilterType.Field },
  ]);

  constructor() {}

  toggle(filter: FilterModel) {
    const filters = this.all.value;
    const existingFilterIdx = filters.findIndex(
      (f) => f.id === filter.id && f.type === filter.type,
    );
    const filterAlreadyExists = existingFilterIdx > -1;
    if (filterAlreadyExists) {
      filters.splice(existingFilterIdx, 1);
    } else {
      filters.push(filter);
    }
    this.all.next(filters);
  }

  has(id: string, type: FilterType): boolean {
    return (
      this.all.value.find((f) => f.id === id && f.type === type) !== undefined
    );
  }
}
