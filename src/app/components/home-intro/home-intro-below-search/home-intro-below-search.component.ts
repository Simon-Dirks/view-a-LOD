import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-intro-below-search',
  standalone: true,
  imports: [],
  templateUrl: './home-intro-below-search.component.html',
  styleUrl: './home-intro-below-search.component.scss',
})
export class HomeIntroBelowSearchComponent {
  constructor(public router: Router) {}
}
