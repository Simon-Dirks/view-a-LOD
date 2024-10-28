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
import { FilterPanelLocation } from '../../../models/settings/filter-panel-location.enum';
import { SettingsService } from '../../../services/settings.service';
import { FormsModule } from '@angular/forms';
import { UiService } from '../../../services/ui.service';

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
  ],
  templateUrl: './filter-options.component.html',
  styleUrl: './filter-options.component.scss',
})
export class FilterOptionsComponent {
  hasOptionsToShow = false;

  constructor(
    public filters: FilterService,
    public settings: SettingsService,
    public ui: UiService,
  ) {}

  ngOnInit() {
    this.initHasOptionsToShow();
  }

  initHasOptionsToShow() {
    this.filters.options.subscribe((options) => {
      this.hasOptionsToShow = false;
      for (let filterId of Object.keys(options)) {
        const filterIdHasValuesToShow =
          this.filters.getOptionValueIds(filterId).length > 0;
        if (filterIdHasValuesToShow) {
          this.hasOptionsToShow = true;
          return;
        }
      }
    });
  }

  protected readonly Object = Object;
  protected readonly FilterType = FilterType;
  protected readonly Settings = Settings;
  protected readonly FilterPanelLocation = FilterPanelLocation;
}
