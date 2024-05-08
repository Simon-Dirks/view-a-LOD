import { Component, Input } from '@angular/core';
import { HopLinkComponent } from '../hop-link/hop-link.component';

@Component({
  selector: 'app-mdto-dekking-in-tijd',
  standalone: true,
  imports: [HopLinkComponent],
  templateUrl: './mdto-dekking-in-tijd.component.html',
  styleUrl: './mdto-dekking-in-tijd.component.scss',
})
export class MdtoDekkingInTijdComponent {
  @Input() id?: string;
}
