import { Component, Input } from '@angular/core';
import { NgForOf } from '@angular/common';
import { NodeLinkComponent } from '../../node/node-link/node-link.component';

@Component({
  selector: 'app-filter-option',
  standalone: true,
  imports: [NgForOf, NodeLinkComponent],
  templateUrl: './filter-option.component.html',
  styleUrl: './filter-option.component.scss',
})
export class FilterOptionComponent {
  @Input() fieldIds?: string[];
  @Input() valueIds?: string[];
}
