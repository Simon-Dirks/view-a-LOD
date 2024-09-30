import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
export class NodeLabelComponent implements OnInit, OnChanges {
  @Input() label?: string;
  @Input() shouldTruncate = true;
  @Input() allowLabelExpand = true;
  @Input() highlightStr?: string;
  showingTruncatedLabel = true;

  renderedLabelHtml = '';

  constructor() {}

  ngOnInit() {
    this.updateRenderedLabelHtml();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['label'] || changes['highlightStr']) {
      this.updateRenderedLabelHtml();
    }
  }

  get labelIsTruncated(): boolean {
    if (!this.label) {
      return false;
    }

    const strippedLabel = striptags(this.label);
    const labelWithHighlightsHtml: string = this.getLabelWithHighlightsHtml(
      strippedLabel,
      this.highlightStr ?? '',
    );
    return this.renderedLabelHtml.length !== labelWithHighlightsHtml.length;
  }

  getLabelWithHighlightsHtml(input: string, searchString: string): string {
    if (!searchString) {
      return input;
    }

    // TODO: Use elastic to generate highlights to support search operators (fuzziness, wildcards, etc)
    //  (Also to prevent highlighting keywords such as "OR" or "AND")
    const escapedSearchString = searchString.replace(
      /[.*+?^${}()|[\]\\]/g,
      '\\$&',
    );
    const searchStringWords = escapedSearchString.split(/\s+/);
    const regex = new RegExp(searchStringWords.join('|'), 'gi');

    return input.replace(
      regex,
      (match) => `<span class="bg-accent">${match}</span>`,
    );
  }

  updateRenderedLabelHtml(): void {
    if (!this.label) {
      this.renderedLabelHtml = '';
      return;
    }

    const strippedLabel = striptags(this.label);
    let labelToHighlight = strippedLabel;
    if (this.shouldTruncate && this.showingTruncatedLabel) {
      labelToHighlight = truncate(strippedLabel, Settings.labelMaxChars);
    }
    const labelWithHighlightsHtml: string = this.getLabelWithHighlightsHtml(
      labelToHighlight,
      this.highlightStr ?? '',
    );
    this.renderedLabelHtml = labelWithHighlightsHtml;
  }

  onEllipsisClick($event: MouseEvent) {
    $event.stopPropagation();
    $event.preventDefault();

    if (this.allowLabelExpand) {
      this.showingTruncatedLabel = !this.showingTruncatedLabel;
      this.updateRenderedLabelHtml();
    }
  }
}
