import { Component, OnInit } from '@angular/core';
import { NodeRenderComponent } from '../../node-render.component';
import { JsonPipe, NgForOf, NgIf } from '@angular/common';
import { Settings } from '../../../../../config/settings';
import { NodeLinkComponent } from '../../../node-link/node-link.component';
import { NodeTableViewComponent } from '../../node-table-view/node-table-view.component';

@Component({
  selector: 'app-sdo-photograph',
  standalone: true,
  imports: [JsonPipe, NgForOf, NodeLinkComponent, NodeTableViewComponent, NgIf],
  templateUrl: './sdo-photograph.component.html',
  styleUrl: './sdo-photograph.component.scss',
})
export class SdoPhotographComponent
  extends NodeRenderComponent
  implements OnInit
{
  commentIds: string[] = [];
  dates: string[] = [];
  creators: string[] = [];
  imageUrls: string[] = [];

  ngOnInit(): void {
    this.commentIds = this.nodes.getObjValues(this.node, [
      'https://schema.org/comment',
    ]);
    this.dates = this.nodes.getObjValues(this.node, [
      'https://www.ica.org/standards/RiC/ontology#expressedDateValue',
    ]);
    this.creators = this.nodes.getObjValues(this.node, [
      'https://www.ica.org/standards/RiC/ontology#hasCreator',
    ]);

    this.imageUrls = this.nodes.getObjValues(
      this.node,
      Settings.predicates.images,
    );
  }

  protected readonly Settings = Settings;
  protected readonly Object = Object;
}
