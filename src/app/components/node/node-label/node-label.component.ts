import { Component, Input } from '@angular/core';
import { truncate } from '../../../helpers/util.helper';
import { Settings } from '../../../config/settings';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-node-label',
  standalone: true,
  imports: [NgIf],
  templateUrl: './node-label.component.html',
  styleUrl: './node-label.component.scss',
})
export class NodeLabelComponent {
  @Input() label?: string;
  @Input() shouldTruncate = true;
  showingTruncatedLabel = true;

  get labelIsTruncated(): boolean {
    return this.renderedLabel.length !== this.label?.length;
  }

  get renderedLabel(): string {
    if (!this.label) {
      return '';
    }

    if (this.shouldTruncate && this.showingTruncatedLabel) {
      return truncate(this.label, Settings.labelMaxChars);
    }
    return this.label;
  }

  onEllipsisClick($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();

    this.showingTruncatedLabel = !this.showingTruncatedLabel;
  }
}
