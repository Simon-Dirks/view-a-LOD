import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilterModel } from '../../models/filter.model';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  all: BehaviorSubject<FilterModel[]> = new BehaviorSubject<FilterModel[]>([]);

  constructor() {}

  toggle(filter: FilterModel) {
    const filters = this.all.value;
    const existingFilterIdx = filters.findIndex((f) => f.id === filter.id);
    const filterAlreadyExists = existingFilterIdx > -1;
    if (filterAlreadyExists) {
      filters.splice(existingFilterIdx, 1);
    } else {
      filters.push(filter);
    }
    this.all.next(filters);
  }

  has(id: string): boolean {
    return this.all.value.find((f) => f.id === id) !== undefined;
  }
}
