import { NgIf } from '@angular/common';
import { Component, Input, type OnInit } from '@angular/core';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { FileType, ViewerType } from '../../models/file-type.model';

@Component({
  selector: 'app-doc-viewer',
  standalone: true,
  imports: [NgxDocViewerModule, NgIf],
  templateUrl: './doc-viewer.component.html',
  styleUrl: './doc-viewer.component.css',
})
export class DocViewerComponent implements OnInit {
  @Input() url?: string;
  @Input() fileType?: FileType;

  ngOnInit(): void {}

  getViewer(): ViewerType {
    if (!this.fileType) return ViewerType.GOOGLE;

    switch (this.fileType) {
      case FileType.PDF:
        return ViewerType.PDF;
      case FileType.DOC:
        return ViewerType.GOOGLE; // TODO: Support mammoth?
      default:
        return ViewerType.GOOGLE;
    }
  }

  onLoaded() {
    // console.log('Loaded doc');
  }
}
