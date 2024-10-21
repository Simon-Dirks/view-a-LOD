import { Component, Input, OnInit } from '@angular/core';
import { Direction, NodeModel } from '../../../../../../models/node.model';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
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
import { HopLinkComponent } from '../../../predicate-render-components/hop-components/hop-link/hop-link.component';
import { RenderMode } from '../../../../../../models/settings/render-component-settings.type';
import { MdtoDekkingInTijdComponent } from '../../../predicate-render-components/mdto-dekking-in-tijd/mdto-dekking-in-tijd.component';
import { MdtoUrlBestandComponent } from '../../../predicate-render-components/mdto-url-bestand/mdto-url-bestand.component';
import { HopImageComponent } from '../../../predicate-render-components/hop-components/hop-image/hop-image.component';
import { RicoIdentifierComponent } from '../../../predicate-render-components/rico-identifier/rico-identifier.component';
import { MdtoOmvangComponent } from '../../../predicate-render-components/mdto-omvang/mdto-omvang.component';

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
    JsonPipe,
    MdtoDekkingInTijdComponent,
    MdtoUrlBestandComponent,
    HopImageComponent,
    RicoIdentifierComponent,
    MdtoOmvangComponent,
  ],
  templateUrl: './node-table-cell.component.html',
  styleUrl: './node-table-cell.component.scss',
})
export class NodeTableCellComponent implements OnInit {
  @Input() pred?: string;
  @Input() node?: NodeModel;
  @Input() direction?: Direction;
  @Input() show?: TableCellShowOptions;

  numObjValuesToShow = Config.numObjValuesToShowDefault;
  shouldRenderComponentIds: string[] = [];
  renderComponentIsDefined = false;

  images: string[] = [];
  objValues: string[] = [];

  constructor(
    public nodes: NodeService,
    public renderComponent: RenderComponentService,
  ) {}

  ngOnInit() {
    this.initRenderComponentIds();
    this.initObjValues();

    this.images = this.nodes.getObjValues(
      this.node,
      Settings.predicates.images,
      undefined,
      true,
    );
  }

  initObjValues() {
    if (this.direction === undefined || !this.pred) {
      return;
    }

    this.objValues = this.nodes.getObjValuesByDirection(
      this.node,
      [this.pred],
      this.direction,
    );
  }

  initRenderComponentIds() {
    if (!this.node) {
      return;
    }

    const preds = this.pred ? [this.pred] : [];

    this.shouldRenderComponentIds = this.renderComponent.getIdsToShow(
      this.node,
      RenderMode.ByPredicate,
      preds,
      this.direction,
    );

    this.renderComponentIsDefined = this.renderComponent.isDefined(
      this.node,
      RenderMode.ByPredicate,
      preds,
      this.direction,
    );
  }

  get isIncoming() {
    return this.direction === Direction.Incoming;
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

  get showMoreLabel(): string {
    return `Laad nog ${Math.min(
      this.numObjValuesNotShown,
      Config.additionalNumObjValuesToShowOnClick,
    )} resultaten`;
  }

  protected readonly TableCellShowOptions = TableCellShowOptions;
  protected readonly RenderMode = RenderMode;
  protected readonly Settings = Settings;
  protected readonly featherArrowUpLeft = featherArrowUpLeft;
}
