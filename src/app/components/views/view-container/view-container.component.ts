import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrawerService } from '../../../services/drawer.service';

@Component({
  selector: 'app-view-container',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './view-container.component.html',
  styleUrl: './view-container.component.scss'
})
export class ViewContainerComponent {
  constructor(public drawer: DrawerService) {}
}
