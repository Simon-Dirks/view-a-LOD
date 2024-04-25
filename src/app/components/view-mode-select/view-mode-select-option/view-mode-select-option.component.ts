import { Component, Input } from '@angular/core';
import { ViewModeService } from '../../../services/view-mode.service';
import { ViewMode } from '../../../models/view-mode.enum';
import { NgClass, NgIf } from '@angular/common';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-view-mode-select-option',
  standalone: true,
  imports: [NgIf, NgClass, NgIcon],
  templateUrl: './view-mode-select-option.component.html',
  styleUrl: './view-mode-select-option.component.scss',
})
export class ViewModeSelectOptionComponent {
  @Input() viewMode!: ViewMode;
  @Input() iconName?: string;

  constructor(public viewModes: ViewModeService) {}
}
