import { Component } from '@angular/core';
import { NodeRenderComponent } from '../../node-render.component';
import { NodeTableViewComponent } from '../../node-table-view/node-table-view.component';
import { Direction } from '../../../../../models/node.model';
import { JsonPipe, NgForOf } from '@angular/common';
import { NodeLinkComponent } from '../../../node-link/node-link.component';
import { HopLinkComponent } from '../../predicate-render-components/hop-components/hop-link/hop-link.component';
import { HopImageComponent } from '../../predicate-render-components/hop-components/hop-image/hop-image.component';
import { Config } from '../../../../../config/config';

@Component({
  selector: 'app-gescand-inventarisnummer',
  standalone: true,
  imports: [
    NodeTableViewComponent,
    JsonPipe,
    NgForOf,
    NodeLinkComponent,
    HopLinkComponent,
    HopImageComponent,
  ],
  templateUrl: './gescand-inventarisnummer.component.html',
  styleUrl: './gescand-inventarisnummer.component.scss',
})
export class GescandInventarisnummerComponent extends NodeRenderComponent {
  images: string[] = [];

  ngOnInit() {
    this.images = this.nodes.getObjValues(
      this.node,
      ['https://schema.org/isPartOf'],
      Direction.Incoming,
    );
  }

  protected readonly Config = Config;
}
