import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NgIconComponent, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'view-a-LOD';

  constructor(private translate: TranslateService) {
    this.translate.addLangs(['nl', 'en']);
    this.translate.setDefaultLang('nl');
    this.translate.use('nl');
  }
}
