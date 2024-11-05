import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-lang-switch',
  standalone: true,
  imports: [NgClass],
  templateUrl: './lang-switch.component.html',
  styleUrl: './lang-switch.component.scss',
})
export class LangSwitchComponent {
  constructor(public translate: TranslateService) {}
}
