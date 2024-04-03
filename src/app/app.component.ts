import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { estypes } from '@elastic/elasticsearch';
import { ElasticService } from './services/elastic.service';
import { BehaviorSubject } from 'rxjs';
import { ListNodeComponent } from './components/list-node/list-node.component';
import { NodeModel } from './models/node.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ListNodeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'view-a-LOD';

  nodes: BehaviorSubject<NodeModel[]> = new BehaviorSubject<NodeModel[]>([]);

  constructor(private elastic: ElasticService) {}

  ngOnInit() {
    void this.search();
  }

  async search() {
    try {
      const response: estypes.SearchResponse<NodeModel> =
        await this.elastic.searchEntities('echtgenote');
      const hits: estypes.SearchHit<NodeModel>[] = response?.hits?.hits;

      for (const hit of hits) {
        const hitNode: NodeModel | undefined = hit?._source;

        if (!hitNode) {
          continue;
        }
        for (const [pred, obj] of Object.entries(hitNode)) {
          if (!pred.includes(' ')) {
            continue;
          }
          const predWithoutSpaces = pred.replaceAll(' ', '.');
          hitNode[predWithoutSpaces] = obj;
          delete hitNode[pred];
        }
        this.nodes.next([...this.nodes.value, hitNode]);
      }
    } catch (error) {
      console.error('Error searching:', error);
    }
  }
}
