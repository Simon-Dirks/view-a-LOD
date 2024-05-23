import { Component, Input } from '@angular/core';
import { HopLinkComponent } from '../hop-components/hop-link/hop-link.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-mdto-dekking-in-tijd',
  standalone: true,
  imports: [HopLinkComponent, NgIf],
  templateUrl: './mdto-dekking-in-tijd.component.html',
  styleUrl: './mdto-dekking-in-tijd.component.scss',
})
export class MdtoDekkingInTijdComponent {
  hasBeginDate = false;
  hasEndDate = false;
  hasType = false;

  @Input() id?: string;
}
