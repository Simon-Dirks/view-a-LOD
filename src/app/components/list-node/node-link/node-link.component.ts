import { Component, Input } from '@angular/core';
import { isValidHttpUrl, replacePrefixes } from '../../../helpers/util.helper';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-node-link',
  standalone: true,
  imports: [NgIf],
  templateUrl: './node-link.component.html',
  styleUrl: './node-link.component.scss',
})
export class NodeLinkComponent {
  @Input() url?: string;
  @Input() label?: string;

  protected readonly replacePrefixes = replacePrefixes;
  protected readonly isValidHttpUrl = isValidHttpUrl;
}
