import { Component } from '@angular/core';
import { FilterService } from '../../../services/search/filter.service';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../../node/node-link/node-link.component';
import { FilterOptionComponent } from './filter-option/filter-option.component';
import { EndpointsComponent } from '../endpoints/endpoints.component';
import { FilterType } from '../../../models/filter.model';
import { FilterCountComponent } from './filter-count/filter-count.component';
import { SortSelectComponent } from '../../sort-select/sort-select.component';
import { Settings } from '../../../config/settings';
import { SettingsService } from '../../../services/settings.service';
import { FormsModule } from '@angular/forms';
import { UiService } from '../../../services/ui.service';
import { NgIcon } from '@ng-icons/core';
import { ImageFilterComponent } from '../image-filter/image-filter.component';

@Component({
  selector: 'app-filter-options',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    JsonPipe,
    NodeLinkComponent,
    FilterOptionComponent,
    EndpointsComponent,
    FilterCountComponent,
    SortSelectComponent,
    NgClass,
    FormsModule,
    NgIcon,
    ImageFilterComponent,
  ],
  templateUrl: './filter-options.component.html',
  styleUrl: './filter-options.component.scss',
})
export class FilterOptionsComponent {
  constructor(
    public filters: FilterService,
    public settings: SettingsService,
    public ui: UiService,
  ) {}

  ngOnInit() {}

  protected readonly Object = Object;
  protected readonly FilterType = FilterType;
  protected readonly Settings = Settings;
}
