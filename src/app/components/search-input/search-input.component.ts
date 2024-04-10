import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { FormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule, NgIcon, NgIf],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnInit {
  constructor(public search: SearchService) {}

  ngOnInit() {
    this.onSearchInputChange(this.search.queryStr);
  }

  onSearchInputChange(input: string) {
    void this.search.execute(true);
  }
}
