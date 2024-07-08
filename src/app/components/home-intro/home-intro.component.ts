import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-intro',
  standalone: true,
  imports: [],
  templateUrl: './home-intro.component.html',
  styleUrl: './home-intro.component.scss',
})
export class HomeIntroComponent {
  constructor(public router: Router) {}
}
