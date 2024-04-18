import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  featherChevronRight,
  featherCornerDownLeft,
  featherCornerDownRight,
  featherSearch,
} from '@ng-icons/feather-icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgIconComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  viewProviders: [
    provideIcons({
      featherChevronRight,
      featherSearch,
      featherCornerDownRight,
      featherCornerDownLeft,
    }),
  ],
})
export class AppComponent {
  title = 'view-a-LOD';
}
