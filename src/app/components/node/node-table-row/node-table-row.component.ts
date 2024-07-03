import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-node-table-row',
  standalone: true,
  imports: [],
  templateUrl: './node-table-row.component.html',
  styleUrl: './node-table-row.component.scss',
})
export class NodeTableRowComponent {
  @Input() label: string = '';
}
