import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';
import { SearchService } from '../../services/search/search.service';
import { debounceTime, distinctUntilChanged, Subject, tap } from 'rxjs';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, NgIcon, NgIf],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnInit {
  private readonly _searchSubject = new Subject<string | undefined>();

  constructor(public search: SearchService) {}

  ngOnInit() {
    this.initDebouncedSearch();
  }

  initDebouncedSearch() {
    this._searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap((searchQuery) => {
          if (!searchQuery) {
            return;
          }

          this.search.queryStr = searchQuery;

          // TODO: Might trigger double search (filter update triggers search)
          void this.search.clearFilters();
          void this.search.execute(true);
        }),
      )
      .subscribe();
  }

  onSearchInputChange(event: Event) {
    const searchQuery = (event.target as HTMLInputElement).value;
    this._searchSubject.next(searchQuery?.trim());
  }
}
