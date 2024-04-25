import { Injectable } from '@angular/core';
import { ThingWithLabelModel } from '../models/thing-with-label.model';
import { ElasticNodeModel } from '../models/elastic/elastic-node.model';
import { SparqlNodeParentModel } from '../models/sparql/sparql-node-parent.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  replaceElasticNodePredSpacesWithPeriods(node: ElasticNodeModel): void {
    Object.entries(node)
      .filter(([pred]) => pred.includes(' '))
      .map(([pred, obj]) => {
        const predWithoutSpaces = pred.replaceAll(' ', '.');
        node[predWithoutSpaces] = obj;
        delete node[pred];
      });
  }

  getOrderedParentsFromSparqlResults(
    nodeId: string,
    sparqlParentsData: SparqlNodeParentModel[],
  ): ThingWithLabelModel[] {
    const nodeParents: ThingWithLabelModel[] = [];
    let currentNodeId: string | null = nodeId;

    sparqlParentsData = sparqlParentsData.sort((a, b) => {
      if (a.parent && !b.parent) return -1;
      if (!a.parent && b.parent) return 1;
      return 0;
    });

    while (currentNodeId !== null) {
      const sparqlNodeParentData = sparqlParentsData.find(
        (d) => d.id === currentNodeId,
      );
      if (sparqlNodeParentData) {
        const nodeInfo: ThingWithLabelModel = {
          '@id': sparqlNodeParentData.id,
          label: sparqlNodeParentData.title,
        };
        nodeParents.push(nodeInfo);
        currentNodeId = sparqlNodeParentData.parent;
      } else {
        currentNodeId = null;
      }
    }

    return nodeParents.reverse().slice(0, -1);
  }
}
