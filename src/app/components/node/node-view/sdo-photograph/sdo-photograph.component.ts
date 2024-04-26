import { Component } from '@angular/core';
import { NodeViewComponent } from '../node-view.component';
import { JsonPipe, NgForOf } from '@angular/common';
import { Settings } from '../../../../config/settings';
import { NodeLinkComponent } from '../../node-link/node-link.component';
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
    return this.nodes.getObjValues(this.node, Settings.predicates.images);
  }

  protected readonly Settings = Settings;
}
