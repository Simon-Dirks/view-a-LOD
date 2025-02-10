import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DocViewerComponent } from "../doc-viewer/doc-viewer.component";

@Component({
  selector: 'app-home-intro',
  standalone: true,
  imports: [TranslatePipe, AsyncPipe, DocViewerComponent],
  templateUrl: './home-intro.component.html',
  styleUrl: './home-intro.component.scss',
})
export class HomeIntroComponent {
  constructor(
    public router: Router,
    public translate: TranslateService,
  ) {}
}
