import { Component } from '@angular/core';
import { NodeViewComponent } from '../node-view.component';

@Component({
  selector: 'app-sdo-message-view',
  standalone: true,
  imports: [],
  templateUrl: './sdo-message-view.component.html',
  styleUrl: './sdo-message-view.component.scss',
})
export class SdoMessageViewComponent extends NodeViewComponent {}
