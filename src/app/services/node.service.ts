import { Injectable } from '@angular/core';
import { NodeModel, NodeObj, nodeObjAsArray } from '../models/node.model';
import { replacePrefixes, truncate } from '../helpers/util.helper';
import { ThingWithLabelModel } from '../models/thing-with-label.model';
import { Settings } from '../config/settings';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  constructor() {}

  getObj(
    node: NodeModel | undefined,
    preds: string[],
    replacePrefix = false,
  ): NodeObj {
    if (!node) {
      return '';
    }

    for (const pred of preds) {
      const nodeObj: NodeObj = node?.[pred];
      const noObjFoundForThisPred = !nodeObj || nodeObj.length === 0;
      if (noObjFoundForThisPred) {
        continue;
      }

      if (replacePrefix) {
        const nodeObjPrefixesReplaced: NodeObj = Array.isArray(nodeObj)
          ? nodeObj.map((o) => replacePrefixes(o))
          : replacePrefixes(nodeObj);
        return nodeObjPrefixesReplaced;
      }

      return nodeObj;
    }

    return '';
  }

  getObjAsArray(
    node: NodeModel | undefined,
    preds: string[],
    replacePrefix = false,
  ) {
    return nodeObjAsArray(this.getObj(node, preds, replacePrefix));
  }

  getObjForAllPreds(node: NodeModel | undefined, preds: string[]): NodeObj {
    // TODO
    return 'TODO';
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
    const nodeTypes = this.getObjAsArray(node, Settings.predicates.type);
    const views: string[] = [];
    for (const [viewType, view] of Object.entries(Settings.views)) {
      if (nodeTypes.includes(viewType)) {
        views.push(view);
      }
    }

    return views;
  }
}
