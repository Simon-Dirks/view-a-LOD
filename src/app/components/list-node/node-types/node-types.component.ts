import { Component, Input } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { CacheService } from '../../../services/cache.service';
import { replacePrefixes } from '../../../helpers/util.helper';

@Component({
  selector: 'app-node-types',
  standalone: true,
  imports: [NgForOf, NgIf],
  templateUrl: './node-types.component.html',
  styleUrl: './node-types.component.scss',
})
export class NodeTypesComponent {
  @Input() typeIds?: string[];

  constructor(public cache: CacheService) {}

  protected readonly replacePrefixes = replacePrefixes;
}
