import { Component } from '@angular/core';
import { HeaderComponent, HeaderView } from '../../header/header.component';

@Component({
  selector: 'app-colofon',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './colofon.component.html',
  styleUrl: './colofon.component.scss',
})
export class ColofonComponent {
  protected readonly HeaderView = HeaderView;
}
