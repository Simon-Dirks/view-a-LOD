import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  featherArrowDownLeft,
  featherArrowDownRight,
  featherArrowLeft,
  featherArrowRight,
  featherArrowUpLeft,
  featherChevronDown,
  featherChevronRight,
  featherChevronUp,
  featherRotateCcw,
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
      featherRotateCcw,
      featherArrowDownRight,
      featherArrowDownLeft,
      featherArrowUpLeft,
    }),
  ],
})
export class AppComponent {
  title = 'view-a-LOD';
}
