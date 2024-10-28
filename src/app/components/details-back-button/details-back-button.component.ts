import { Component } from '@angular/core';
import { featherArrowLeft } from '@ng-icons/feather-icons';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';
import { DetailsService } from '../../services/details.service';
import { RoutingService } from '../../services/routing.service';

@Component({
  selector: 'app-details-back-button',
  standalone: true,
  imports: [NgIcon, NgIf],
  templateUrl: './details-back-button.component.html',
  styleUrl: './details-back-button.component.scss',
})
export class DetailsBackButtonComponent {
  constructor(
    public details: DetailsService,
    public routing: RoutingService,
  ) {}
  protected readonly featherArrowLeft = featherArrowLeft;
}
