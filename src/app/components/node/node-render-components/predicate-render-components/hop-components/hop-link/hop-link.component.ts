import { Component, OnInit } from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { NodeLinkComponent } from '../../../../node-link/node-link.component';
import { NgIcon } from '@ng-icons/core';
import { featherChevronRight } from '@ng-icons/feather-icons';
import { NodeLabelComponent } from '../../../../node-label/node-label.component';
import { HopComponent } from '../hop.component';

@Component({
  selector: 'app-hop-link',
  standalone: true,
  imports: [
    NgIf,
    JsonPipe,
    NodeLinkComponent,
    NgForOf,
    NgIcon,
    NodeLabelComponent,
  ],
  templateUrl: './hop-link.component.html',
  styleUrl: './hop-link.component.scss',
})
export class HopLinkComponent extends HopComponent implements OnInit {
  protected readonly featherChevronRight = featherChevronRight;
}
