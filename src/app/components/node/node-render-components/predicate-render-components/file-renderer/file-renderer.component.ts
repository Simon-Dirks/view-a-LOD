import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  type OnInit,
} from '@angular/core';
import { SparqlService } from '../../../../../services/sparql.service';
import { NgForOf, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { NodeImagesComponent } from '../../../node-images/node-images.component';
import { DocViewerComponent } from '../../../../doc-viewer/doc-viewer.component';
import { HopLinkSettingsModel } from '../../../../../models/settings/hop-link-settings.model';
import { NodeLinkComponent } from '../../../node-link/node-link.component';
import { MimeTypeService } from '../../../../../services/mime-type.service';
import { FileType } from '../../../../../models/file-type.model';

@Component({
  selector: 'app-file-renderer',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    NodeImagesComponent,
    DocViewerComponent,
    NodeLinkComponent,
    NgSwitch,
    NgSwitchCase,
  ],
  templateUrl: './file-renderer.component.html',
  styleUrl: './file-renderer.component.css',
})
export class FileRendererComponent implements OnInit, OnChanges {
  protected readonly FileType = FileType;

  private static readonly SUPPORTED_MIME_TYPES = {
    [FileType.IMAGE]: ['image/'],
    [FileType.PDF]: ['application/pdf'],
    [FileType.DOC]: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
  } as const;

  @Output() loaded = new EventEmitter<void>();

  @Input() urls: string | string[] = [];
  @Input() hopSettings?: HopLinkSettingsModel;
  @Input() fullHeight = false;
  @Input() isThumb = false;

  fileUrls: string[] = [];
  loading = false;
  urlMimeTypes = new Map<string, string>();

  get displayUrls(): string[] {
    return this.isThumb ? this.fileUrls.slice(0, 1) : this.fileUrls;
  }

  get allFilesType(): FileType {
    if (this.fileUrls.length === 0) return FileType.UNKNOWN;

    const types = new Set(this.fileUrls.map((url) => this.getFileType(url)));
    if (types.size === 1) {
      const type = types.values().next().value;
      if (
        type === FileType.IMAGE ||
        type === FileType.DOC ||
        type === FileType.PDF
      )
        return type;
    }
    return FileType.UNKNOWN;
  }

  constructor(
    private sparql: SparqlService,
    private mimeTypeService: MimeTypeService,
  ) {}

  ngOnInit(): void {
    void this.initFileUrls();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['urls'] && !changes['urls'].firstChange) {
      void this.initFileUrls();
    }
  }

  private async initFileUrls() {
    const inputUrls = Array.isArray(this.urls) ? this.urls : [this.urls];
    const validUrls = inputUrls.filter((url) => url);

    if (validUrls.length === 0) {
      return;
    }

    this.loading = true;

    try {
      if (
        this.hopSettings &&
        this.hopSettings.preds &&
        this.hopSettings.preds.length > 0
      ) {
        const urlPromises = validUrls.map((url) =>
          this.sparql.getObjIds(url, this.hopSettings!.preds),
        );

        const results = await Promise.all(urlPromises);
        this.fileUrls = results.flat();
      } else {
        this.fileUrls = validUrls;
      }

      await Promise.all(
        this.fileUrls.map(async (url) => {
          const mimeType = await this.mimeTypeService.getMimeType(url);
          if (mimeType) {
            this.urlMimeTypes.set(url, mimeType);
          }
        }),
      );
    } finally {
      this.loading = false;
      this.loaded.emit();
    }
  }

  getFileType(url: string): FileType {
    const mimeType = this.urlMimeTypes.get(url);
    if (!mimeType) return FileType.UNKNOWN;

    for (const [type, patterns] of Object.entries(
      FileRendererComponent.SUPPORTED_MIME_TYPES,
    )) {
      if (patterns.some((pattern) => mimeType.startsWith(pattern))) {
        return type as FileType;
      }
    }

    return FileType.UNKNOWN;
  }
}
