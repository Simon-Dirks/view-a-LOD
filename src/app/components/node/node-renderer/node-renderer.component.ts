import { Component, Input } from '@angular/core';
import { JsonPipe, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { NodeTableViewComponent } from '../node-render-components/node-table-view/node-table-view.component';
import { NodeModel } from '../../../models/node.model';
import { NodeService } from '../../../services/node.service';
import { Settings } from '../../../config/settings';
import { RenderComponentService } from '../../../services/render-component.service';
import { SdoPhotographComponent } from '../node-render-components/type-render-components/sdo-photograph/sdo-photograph.component';
import { RenderMode } from '../../../models/settings/render-component-settings.type';

@Component({
  selector: 'app-node-renderer',
  standalone: true,
  imports: [
    NodeTableViewComponent,
    NgIf,
    NgSwitch,
    NgSwitchCase,
    SdoPhotographComponent,
    JsonPipe,
  ],
  templateUrl: './node-renderer.component.html',
  styleUrl: './node-renderer.component.scss',
})
export class NodeRendererComponent {
  @Input() node?: NodeModel;

  constructor(
    public nodes: NodeService,
    public renderComponents: RenderComponentService,
  ) {}

  protected readonly Settings = Settings;
  protected readonly RenderMode = RenderMode;
}
