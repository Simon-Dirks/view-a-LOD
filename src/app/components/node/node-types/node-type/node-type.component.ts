import { Component, Input } from '@angular/core';
import { NodeLinkComponent } from '../../node-link/node-link.component';

@Component({
  selector: 'app-node-type',
  standalone: true,
  imports: [NodeLinkComponent],
  templateUrl: './node-type.component.html',
  styleUrl: './node-type.component.scss',
})
export class NodeTypeComponent {
  @Input() typeId?: string;
}
