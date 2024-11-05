import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgClass, NgIf } from '@angular/common';
import { Settings } from '../../config/settings';

@Component({
  selector: 'app-lang-switch',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './lang-switch.component.html',
  styleUrl: './lang-switch.component.scss',
})
export class LangSwitchComponent {
  constructor(public translate: TranslateService) {}

  protected readonly Settings = Settings;
}
