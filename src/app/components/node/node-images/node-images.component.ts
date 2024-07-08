import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Config } from '../../../config/config';
import { CdnService } from '../../../services/cdn.service';

@Component({
  selector: 'app-node-images',
  standalone: true,
  imports: [NgForOf, NgIf, JsonPipe],
  templateUrl: './node-images.component.html',
  styleUrl: './node-images.component.scss',
})
export class NodeImagesComponent implements OnInit, OnChanges {
  @Input() imageUrls?: string[];
  @Input() width = '5rem';

  processedImageUrls: string[] = [];

  constructor(public cdn: CdnService) {}

  ngOnInit() {
    this.processImageUrls();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrls']) {
      this.processImageUrls();
    }
  }

  private processImageUrls() {
    if (!this.imageUrls) {
      return;
    }

    this.processedImageUrls = this.cdn.processUrls(this.imageUrls);
  }

  protected readonly Config = Config;
}
