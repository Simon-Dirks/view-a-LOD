import { Component, Input } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { CacheService } from '../../../services/cache.service';
import { replacePrefixes } from '../../../helpers/util.helper';
import { NodeLinkComponent } from '../node-link/node-link.component';
import { NodeTypeComponent } from './node-type/node-type.component';

@Component({
  selector: 'app-node-types',
  standalone: true,
  imports: [NgForOf, NgIf, NodeLinkComponent, NodeTypeComponent],
  templateUrl: './node-types.component.html',
  styleUrl: './node-types.component.scss',
})
export class NodeTypesComponent {
  @Input() typeIds?: string[];

  constructor(public cache: CacheService) {}

  getLabel(typeId: string) {
    return this.cache.labels?.[typeId] ?? replacePrefixes(typeId);
  }
}
