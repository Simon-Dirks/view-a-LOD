import { Injectable } from '@angular/core';
import { SparqlNodeParentModel } from '../models/sparql/sparql-node-parent';
import { NodeBasicInfoModel } from '../models/node-basic-info.model';
import { NodeModel } from '../models/node.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  replaceNodePredSpacesWithPeriods(node: NodeModel): void {
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
    sparqlParentsData: SparqlNodeParentModel[]
  ): NodeBasicInfoModel[] {
    const nodeParents: NodeBasicInfoModel[] = [];
    let currentNodeId: string | null = nodeId;

    while (currentNodeId !== null) {
      const sparqlNodeParentData = sparqlParentsData.find(
        (d) => d.id === currentNodeId
      );
      if (sparqlNodeParentData) {
        const nodeInfo: NodeBasicInfoModel = {
          '@id': sparqlNodeParentData.id,
          title: sparqlNodeParentData.title,
        };
        nodeParents.push(nodeInfo);
        currentNodeId = sparqlNodeParentData.parent;
      } else {
        currentNodeId = null;
      }
    }

    return nodeParents.reverse();
  }
}
