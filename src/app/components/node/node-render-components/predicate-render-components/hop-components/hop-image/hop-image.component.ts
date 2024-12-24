import { Component } from '@angular/core';
import { HopComponent } from '../hop.component';
import { NgForOf, NgIf } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { NodeLinkComponent } from '../../../../node-link/node-link.component';
import { NodeImagesComponent } from '../../../../node-images/node-images.component';

@Component({
  selector: 'app-hop-image',
  standalone: true,
  imports: [NgIf, NgForOf, NgIcon, NodeLinkComponent, NodeImagesComponent],
  templateUrl: './hop-image.component.html',
  styleUrl: './hop-image.component.scss',
})
export class HopImageComponent extends HopComponent {}
