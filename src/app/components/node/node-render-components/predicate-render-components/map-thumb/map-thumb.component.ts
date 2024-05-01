import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-thumb',
  standalone: true,
  imports: [],
  templateUrl: './map-thumb.component.html',
  styleUrl: './map-thumb.component.scss',
})
export class MapThumbComponent implements AfterViewInit {
  private map?: L.Map;
  @ViewChild('mapElem') mapElem!: ElementRef;

  private initMap(): void {
    // TODO: Pass coordinates as input
    this.map = L.map(this.mapElem.nativeElement, {
      center: [39.8282, -98.5795],
      zoom: 3,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      },
    );

    tiles.addTo(this.map);
  }

  ngAfterViewInit() {
    this.initMap();
  }
}
