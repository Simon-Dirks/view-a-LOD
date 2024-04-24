import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  featherArrowLeft,
  featherArrowRight,
  featherChevronDown,
  featherChevronRight,
  featherChevronUp,
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
      featherChevronDown,
      featherChevronUp,
      featherSearch,
      featherArrowLeft,
      featherArrowRight,
    }),
  ],
})
export class AppComponent {
  title = 'view-a-LOD';
}
