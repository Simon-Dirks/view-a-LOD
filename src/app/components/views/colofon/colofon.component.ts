import { Component } from '@angular/core';
import { HeaderComponent, HeaderView } from '../../header/header.component';
import { ViewContainerComponent } from '../view-container/view-container.component';

@Component({
  selector: 'app-colofon',
  standalone: true,
  imports: [HeaderComponent, ViewContainerComponent],
  templateUrl: './colofon.component.html',
  styleUrl: './colofon.component.scss',
})
export class ColofonComponent {
  protected readonly HeaderView = HeaderView;
}
