import { Component, OnInit } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnInit {
  searchInput: string = 'Margaretha';

  constructor(public search: SearchService) {}

  ngOnInit() {
    this.onSearchInputChange(this.searchInput);
  }

  onSearchInputChange(input: string) {
    void this.search.execute(input);
  }
}
