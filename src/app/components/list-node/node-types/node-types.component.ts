import { Component, Input } from '@angular/core';
import { removePrefixes } from '../../../helpers/util.helper';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-node-types',
  standalone: true,
  imports: [NgForOf, NgIf],
  templateUrl: './node-types.component.html',
  styleUrl: './node-types.component.scss',
})
export class NodeTypesComponent {
  @Input() types?: string[];

  protected readonly removePrefixes = removePrefixes;
}
