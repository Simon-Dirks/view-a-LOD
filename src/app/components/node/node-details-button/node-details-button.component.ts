import { Component, Input } from '@angular/core';
import { featherArrowRight } from '@ng-icons/feather-icons';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';
import { DetailsService } from '../../../services/details.service';
import { NodeModel } from '../../../models/node.model';

@Component({
  selector: 'app-node-details-button',
  standalone: true,
  imports: [NgIcon, NgIf],
  templateUrl: './node-details-button.component.html',
  styleUrl: './node-details-button.component.scss',
})
export class NodeDetailsButtonComponent {
  @Input() node: NodeModel | undefined;

  constructor(public details: DetailsService) {}
  protected readonly featherArrowRight = featherArrowRight;
}
