import { Component, Input } from '@angular/core';
import { JsonPipe, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { NodeTableViewComponent } from '../node-view/node-table-view/node-table-view.component';
import { NodeModel } from '../../../models/node.model';
import { NodeService } from '../../../services/node.service';
import { Settings } from '../../../config/settings';
import { RenderComponentService } from '../../../services/render-component.service';
import { RenderMode } from '../../../models/settings/view-component-settings.type';
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
    JsonPipe,
  ],
  templateUrl: './node-view-renderer.component.html',
  styleUrl: './node-view-renderer.component.scss',
})
export class NodeViewRendererComponent {
  @Input() node?: NodeModel;

  constructor(
    public nodes: NodeService,
    public renderComponents: RenderComponentService,
  ) {}

  protected readonly Settings = Settings;
  protected readonly RenderMode = RenderMode;
}
