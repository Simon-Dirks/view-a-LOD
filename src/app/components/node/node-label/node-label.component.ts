import { Component, Input } from '@angular/core';
import { truncate } from '../../../helpers/util.helper';
import { Settings } from '../../../config/settings';
import { NgClass, NgIf } from '@angular/common';
import striptags from 'striptags';

@Component({
  selector: 'app-node-label',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './node-label.component.html',
  styleUrl: './node-label.component.scss',
})
export class NodeLabelComponent {
  @Input() label?: string;
  @Input() shouldTruncate = true;
  @Input() allowLabelExpand = true;
  showingTruncatedLabel = true;

  get labelIsTruncated(): boolean {
    return this.renderedLabel.length !== this.label?.length;
  }

  get renderedLabel(): string {
    if (!this.label) {
      return '';
    }

    if (this.shouldTruncate && this.showingTruncatedLabel) {
      return truncate(striptags(this.label), Settings.labelMaxChars);
    }
    return striptags(this.label);
  }

  onEllipsisClick($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();

    if (this.allowLabelExpand) {
      this.showingTruncatedLabel = !this.showingTruncatedLabel;
    }
  }
}
