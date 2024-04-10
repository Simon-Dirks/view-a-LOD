import { Component, Input } from '@angular/core';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { NodeTableViewComponent } from '../node-view/node-table-view/node-table-view.component';
import { SdoArticleViewComponent } from '../node-view/sdo-article-view/sdo-article-view.component';
import { RicoRecordViewComponent } from '../node-view/rico-record-view/rico-record-view.component';
import { NodeModel } from '../../models/node.model';
import { NodeService } from '../../services/node.service';
import { Settings } from '../../config/settings';
import { SdoMessageViewComponent } from '../node-view/sdo-message-view/sdo-message-view.component';

@Component({
  selector: 'app-node-view-renderer',
  standalone: true,
  imports: [
    NodeTableViewComponent,
    NgIf,
    SdoArticleViewComponent,
    NgSwitch,
    NgSwitchCase,
    RicoRecordViewComponent,
    SdoMessageViewComponent,
  ],
  templateUrl: './node-view-renderer.component.html',
  styleUrl: './node-view-renderer.component.scss',
})
export class NodeViewRendererComponent {
  @Input() node?: NodeModel;

  constructor(public nodes: NodeService) {}

  get views(): string[] {
    if (!this.node) {
      return [];
    }

    return this.nodes.getViewsBasedOnTypes(this.node);
  }

  protected readonly Settings = Settings;
}
