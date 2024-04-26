import { Component, Input } from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-node-images',
  standalone: true,
  imports: [NgForOf, NgIf, JsonPipe],
  templateUrl: './node-images.component.html',
  styleUrl: './node-images.component.scss',
})
export class NodeImagesComponent {
  @Input() images?: string[];
}
