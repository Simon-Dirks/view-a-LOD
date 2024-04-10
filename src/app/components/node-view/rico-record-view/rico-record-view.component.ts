import { Component } from '@angular/core';
import { NodeViewComponent } from '../node-view.component';

@Component({
  selector: 'app-rico-record-view',
  standalone: true,
  imports: [],
  templateUrl: './rico-record-view.component.html',
  styleUrl: './rico-record-view.component.scss',
})
export class RicoRecordViewComponent extends NodeViewComponent {}
