import { Component, Input } from '@angular/core';
import { NodeModel } from '../../../models/node.model';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';
import { featherLink } from '@ng-icons/feather-icons';
import { UrlService } from '../../../services/url.service';
import { NodeService } from '../../../services/node.service';

@Component({
  selector: 'app-node-permalink-button',
  standalone: true,
  imports: [NgIcon, NgIf],
  templateUrl: './node-permalink-button.component.html',
  styleUrl: './node-permalink-button.component.scss',
})
export class NodePermalinkButtonComponent {
  @Input() node: NodeModel | undefined;
  constructor(
    public urlService: UrlService,
    public nodes: NodeService,
  ) {}
  protected readonly featherLink = featherLink;
}
