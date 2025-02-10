import { NgIf } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { NgxDocViewerModule } from 'ngx-doc-viewer';

@Component({
  selector: 'app-doc-viewer',
  standalone: true,
  imports: [NgxDocViewerModule, NgIf],
  templateUrl: './doc-viewer.component.html',
  styleUrl: './doc-viewer.component.css',
})
export class DocViewerComponent implements OnInit {
  @Input() url?: string;

  ngOnInit(): void {}
}
