import { Component, Input } from '@angular/core';
import { Direction, NodeModel } from '../../../../../../models/node.model';
import { NgForOf, NgIf } from '@angular/common';
import { NgIcon } from '@ng-icons/core';
import { NodeLinkComponent } from '../../../../node-link/node-link.component';
import { NodeService } from '../../../../../../services/node.service';
import { Config } from '../../../../../../config/config';
import { RenderComponentService } from '../../../../../../services/render-component.service';
import { SdoPhotographComponent } from '../../../type-render-components/sdo-photograph/sdo-photograph.component';
import { NodeImagesComponent } from '../../../../node-images/node-images.component';
import { Settings } from '../../../../../../config/settings';
import { MapThumbComponent } from '../../../predicate-render-components/map-thumb/map-thumb.component';
import { featherArrowUpLeft } from '@ng-icons/feather-icons';
import { NodeTypeComponent } from '../../../../node-types/node-type/node-type.component';
import { HopLinkComponent } from '../../../predicate-render-components/hop-link/hop-link.component';
import { RenderMode } from '../../../../../../models/settings/render-component-settings.type';

export enum TableCellShowOptions {
  Pred,
  Obj,
}

@Component({
  selector: 'app-node-table-cell',
  standalone: true,
  imports: [
    NgForOf,
    NgIcon,
    NgIf,
    NodeLinkComponent,
    SdoPhotographComponent,
    NodeImagesComponent,
    MapThumbComponent,
    NodeTypeComponent,
    HopLinkComponent,
  ],
  templateUrl: './node-table-cell.component.html',
  styleUrl: './node-table-cell.component.scss',
})
export class NodeTableCellComponent {
  @Input() pred?: string;
  @Input() node?: NodeModel;
  @Input() direction?: Direction;
  @Input() show?: TableCellShowOptions;

  numObjValuesToShow = Config.numObjValuesToShowDefault;

  constructor(
    public nodes: NodeService,
    public renderComponent: RenderComponentService,
  ) {}

  get isIncoming() {
    return this.direction === Direction.Incoming;
  }

  get objValues(): string[] {
    if (this.direction === undefined || !this.pred) {
      return [];
    }

    return this.nodes.getObjValuesByDirection(
      this.node,
      [this.pred],
      this.direction,
    );
  }
  get objValuesToShow(): string[] {
    return this.objValues.slice(0, this.numObjValuesToShow);
  }

  get numObjValuesNotShown(): number {
    return this.objValues.length - this.numObjValuesToShow;
  }

  loadMoreObjValues() {
    this.numObjValuesToShow += Config.additionalNumObjValuesToShowOnClick;
  }

  shouldRenderComponent(componentId: string, pred: string) {
    if (!this.node) {
      return false;
    }
    return this.renderComponent.shouldShow(
      this.node,
      RenderMode.ByPredicate,
      componentId,
      [pred],
    );
  }

  get showMoreLabel(): string {
    return `Show ${Math.min(
      this.numObjValuesNotShown,
      Config.additionalNumObjValuesToShowOnClick,
    )} more...`;
  }

  protected readonly TableCellShowOptions = TableCellShowOptions;
  protected readonly RenderMode = RenderMode;
  protected readonly Settings = Settings;
  protected readonly featherArrowUpLeft = featherArrowUpLeft;
}
