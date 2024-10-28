import { Component, EventEmitter, Output } from '@angular/core';
import {
  AutocompleteOptionModel,
  AutocompleteOptionType,
} from '../../models/autocomplete-option.model';
import { NgForOf, NgIf } from '@angular/common';
import { AutocompleteService } from '../../services/autocomplete.service';
import { featherArrowRight, featherSearch } from '@ng-icons/feather-icons';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-search-autocomplete',
  standalone: true,
  imports: [NgForOf, NgIf, NgIcon],
  templateUrl: './search-autocomplete.component.html',
  styleUrl: './search-autocomplete.component.scss',
})
export class SearchAutocompleteComponent {
  @Output() selected: EventEmitter<AutocompleteOptionModel> =
    new EventEmitter<AutocompleteOptionModel>();

  constructor(public autocomplete: AutocompleteService) {}

  protected readonly AutoCompleteOptionType = AutocompleteOptionType;
  protected readonly AutocompleteOptionType = AutocompleteOptionType;
  protected readonly featherSearch = featherSearch;
  protected readonly featherArrowRight = featherArrowRight;
}
