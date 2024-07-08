import { Component, Input } from '@angular/core';
import { NodeLinkComponent } from '../../node-link/node-link.component';
import { TypeModel } from '../../../../models/type.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-node-type',
  standalone: true,
  imports: [NodeLinkComponent, NgClass],
  templateUrl: './node-type.component.html',
  styleUrl: './node-type.component.scss',
})
export class NodeTypeComponent {
  @Input() showNeutralColors = false;
  @Input() type?: TypeModel;
}
