import { Component, OnInit } from '@angular/core';
import { ListNodeComponent } from '../../list-node/list-node.component';
import { NgForOf } from '@angular/common';
import { SearchService } from '../../../services/search.service';
import { SearchInputComponent } from '../../search-input/search-input.component';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [ListNodeComponent, NgForOf, SearchInputComponent],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  constructor(public search: SearchService) {}

  ngOnInit() {}
}
