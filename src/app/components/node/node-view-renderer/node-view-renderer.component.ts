import { Component, Input } from '@angular/core';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { NodeTableViewComponent } from '../node-view/node-table-view/node-table-view.component';
import { NodeModel } from '../../../models/node.model';
import { NodeService } from '../../../services/node.service';
import { Settings } from '../../../config/settings';
import { SdoPhotographComponent } from '../node-view/sdo-photograph/sdo-photograph.component';

@Component({
  selector: 'app-node-view-renderer',
  standalone: true,
  imports: [
    NodeTableViewComponent,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    SdoPhotographComponent,
  ],
  templateUrl: './node-view-renderer.component.html',
  styleUrl: './node-view-renderer.component.scss',
})
export class NodeViewRendererComponent {
  @Input() node?: NodeModel;

  constructor(public nodes: NodeService) {}

  get viewComponents(): string[] {
    if (!this.node) {
      return [];
    }

    return this.nodes.getViewsBasedOnTypes(this.node);
  }

  get hasDefinedViewComponent(): boolean {
    return (
      this.allDefinedViewComponents.filter((c) =>
        this.viewComponents.includes(c),
      ).length > 0
    );
  }

  get allDefinedViewComponents(): string[] {
    return Object.values(Settings.viewComponents);
  }

  protected readonly Settings = Settings;
}
