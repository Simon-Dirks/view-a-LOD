import { Component, Input, OnInit } from '@angular/core';
import { JsonPipe, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { NodeTableViewComponent } from '../node-render-components/node-table-view/node-table-view.component';
import { NodeModel } from '../../../models/node.model';
import { NodeService } from '../../../services/node.service';
import { Settings } from '../../../config/settings';
import { RenderComponentService } from '../../../services/render-component.service';
import { SdoPhotographComponent } from '../node-render-components/type-render-components/sdo-photograph/sdo-photograph.component';
import { RenderMode } from '../../../models/settings/render-component-settings.type';
import { GescandInventarisnummerComponent } from '../node-render-components/type-render-components/gescand-inventarisnummer/gescand-inventarisnummer.component';
import {HuaRubriekComponent} from "../node-render-components/type-render-components/hua-rubriek/hua-rubriek.component";

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
        GescandInventarisnummerComponent,
        HuaRubriekComponent,
    ],
  templateUrl: './node-renderer.component.html',
  styleUrl: './node-renderer.component.scss',
})
export class NodeRendererComponent implements OnInit {
  @Input() node?: NodeModel;

  renderComponentIdsToShow: string[] = [];
  renderComponentIsDefined = false;

  constructor(
    public nodes: NodeService,
    public renderComponents: RenderComponentService,
  ) {}

  ngOnInit() {
    this.initRenderComponentIds();
  }

  initRenderComponentIds() {
    if (!this.node) {
      return;
    }
    this.renderComponentIdsToShow = this.renderComponents.getIdsToShow(
      this.node,
      RenderMode.ByType,
    );

    this.renderComponentIsDefined = this.renderComponents.isDefined(
      this.node,
      RenderMode.ByType,
    );
  }

  protected readonly Settings = Settings;
  protected readonly RenderMode = RenderMode;
}
