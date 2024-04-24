import { Component } from '@angular/core';
import { NodeViewComponent } from '../node-view.component';
import { JsonPipe, NgForOf } from '@angular/common';
import { Settings } from '../../../config/settings';
import { replacePrefixes } from '../../../helpers/util.helper';
import { NodeLinkComponent } from '../../list-node/node-link/node-link.component';
import { nodeObjValuesAsArray } from '../../../models/node.model';
import { NodeTableViewComponent } from '../node-table-view/node-table-view.component';

@Component({
  selector: 'app-sdo-photograph',
  standalone: true,
  imports: [JsonPipe, NgForOf, NodeLinkComponent, NodeTableViewComponent],
  templateUrl: './sdo-photograph.component.html',
  styleUrl: './sdo-photograph.component.scss',
})
export class SdoPhotographComponent extends NodeViewComponent {
  get imageUrls(): string[] {
    // return [
    //   'https://loremflickr.com/320/240',
    //   'https://loremflickr.com/320/200',
    //   'https://loremflickr.com/400/240',
    // ];
    return this.nodes.getObjAsArray(this.node, Settings.predicates.images);
  }

  protected readonly Settings = Settings;
  protected readonly replacePrefixes = replacePrefixes;
  protected readonly nodeObjValuesAsArray = nodeObjValuesAsArray;
}
