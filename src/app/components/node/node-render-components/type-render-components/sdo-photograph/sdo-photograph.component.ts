import { Component, OnInit } from '@angular/core';
import { NodeRenderComponent } from '../../node-render.component';
import { JsonPipe, NgForOf } from '@angular/common';
import { Settings } from '../../../../../config/settings';
import { NodeLinkComponent } from '../../../node-link/node-link.component';
import { NodeTableViewComponent } from '../../node-table-view/node-table-view.component';

@Component({
  selector: 'app-sdo-photograph',
  standalone: true,
  imports: [JsonPipe, NgForOf, NodeLinkComponent, NodeTableViewComponent],
  templateUrl: './sdo-photograph.component.html',
  styleUrl: './sdo-photograph.component.scss',
})
export class SdoPhotographComponent
  extends NodeRenderComponent
  implements OnInit
{
  commentIds: string[] = [];
  imageUrls: string[] = [];

  ngOnInit(): void {
    this.commentIds = this.nodes.getObjValues(this.node, [
      'https://schema.org/comment',
    ]);
    this.imageUrls = this.nodes.getObjValues(
      this.node,
      Settings.predicates.images,
    );
  }

  protected readonly Settings = Settings;
}
