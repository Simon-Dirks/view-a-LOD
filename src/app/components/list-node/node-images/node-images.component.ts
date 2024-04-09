import { Component, Input } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-node-images',
  standalone: true,
  imports: [NgForOf, NgIf],
  templateUrl: './node-images.component.html',
  styleUrl: './node-images.component.scss',
})
export class NodeImagesComponent {
  @Input() images?: string[];
}
