import { Component, Input } from '@angular/core';
import { NodeLinkComponent } from '../../node-link/node-link.component';
import { TypeModel } from '../../../../models/type.model';

@Component({
  selector: 'app-node-type',
  standalone: true,
  imports: [NodeLinkComponent],
  templateUrl: './node-type.component.html',
  styleUrl: './node-type.component.scss',
})
export class NodeTypeComponent {
  @Input() type?: TypeModel;
}
