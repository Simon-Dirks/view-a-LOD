import { Component } from '@angular/core';
import { NodeViewComponent } from '../node-view.component';

@Component({
  selector: 'app-sdo-article-view',
  standalone: true,
  imports: [],
  templateUrl: './sdo-article-view.component.html',
  styleUrl: './sdo-article-view.component.scss',
})
export class SdoArticleViewComponent extends NodeViewComponent {}
