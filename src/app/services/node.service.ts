import { Injectable } from '@angular/core';
import { Direction, NodeModel, NodeObj } from '../models/node.model';
import { replacePrefixes, truncate } from '../helpers/util.helper';
import { ThingWithLabelModel } from '../models/thing-with-label.model';
import { Settings } from '../config/settings';
import { SparqlService } from './sparql.service';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  constructor(private sparql: SparqlService) {}

  getObjs(
    node: NodeModel | undefined,
    preds: string[],
    replacePrefix = false,
  ): NodeObj[] {
    if (!node) {
      return [];
    }

    const objs = [];
    for (const pred of preds) {
      if (!(pred in node)) {
        continue;
      }
      for (const obj of node[pred]) {
        const noObjFoundForThisPred =
          !obj || !obj?.value || obj?.value?.length === 0;
        if (noObjFoundForThisPred) {
          continue;
        }

        const objValue = replacePrefix ? replacePrefixes(obj.value) : obj.value;
        objs.push({
          value: objValue,
          direction: obj.direction,
        });
      }
    }

    return objs;
  }

  getObjValues(
    node: NodeModel | undefined,
    preds: string[],
    replacePrefix = false,
  ) {
    return this.getObjs(node, preds, replacePrefix).map((o) => o.value);
  }

  getTitle(node: ThingWithLabelModel, maxCharacters?: number): string {
    const nodeTitle = node.label;
    if (nodeTitle) {
      const shouldTruncate = maxCharacters !== undefined;
      return shouldTruncate ? truncate(nodeTitle, maxCharacters) : nodeTitle;
    }
    return replacePrefixes(node['@id']);
  }

  getViewsBasedOnTypes(node: NodeModel): string[] {
    const nodeTypes: string[] = this.getObjValues(
      node,
      Settings.predicates.type,
    );
    const views: string[] = [];
    for (const [viewType, view] of Object.entries(Settings.viewComponents)) {
      if (nodeTypes.includes(viewType)) {
        views.push(view);
      }
    }

    return views;
  }

  getId(node: NodeModel): string {
    return this.getObjValues(node, ['@id'])[0];
  }

  async enrichWithIncomingRelations(nodes: NodeModel[]): Promise<NodeModel[]> {
    for (const node of nodes) {
      this.sparql.getIncomingRelations(node).then((sparqlIncomingRelations) => {
        for (const sparqlIncomingRelation of sparqlIncomingRelations) {
          const pred = sparqlIncomingRelation.pred;
          if (!(pred in node)) {
            node[pred] = [];
          }

          const existingValues: string[] = this.getObjValues(node, [pred]);
          const relationIsAlreadySaved = existingValues.includes(
            sparqlIncomingRelation.sub,
          );
          if (relationIsAlreadySaved) {
            continue;
          }

          const incomingRelation: NodeObj = {
            value: sparqlIncomingRelation.sub,
            direction: Direction.Incoming,
          };

          node[pred].push(incomingRelation);
        }
      });
    }

    return nodes;
  }
}
