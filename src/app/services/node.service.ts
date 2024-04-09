import { Injectable } from '@angular/core';
import { NodeModel, NodeObj, nodeObjAsArray } from '../models/node.model';
import { removePrefixes, truncate } from '../helpers/util.helper';
import { NodeBasicInfoModel } from '../models/node-basic-info.model';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  constructor() {}

  getObj(
    node: NodeModel | undefined,
    preds: string[],
    stripPrefix = false,
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

      if (stripPrefix) {
        const nodeObjStripped: NodeObj = Array.isArray(nodeObj)
          ? nodeObj.map((o) => removePrefixes(o))
          : removePrefixes(nodeObj);
        return nodeObjStripped;
      }

      return nodeObj;
    }

    return '';
  }

  getObjAsArray(
    node: NodeModel | undefined,
    preds: string[],
    stripPrefix = false,
  ) {
    return nodeObjAsArray(this.getObj(node, preds, stripPrefix));
  }

  getObjForAllPreds(node: NodeModel | undefined, preds: string[]): NodeObj {
    // TODO
    return 'TODO';
  }

  getTitle(node: NodeBasicInfoModel, maxCharacters?: number): string {
    const nodeTitle = node.title;
    if (nodeTitle) {
      const shouldTruncate = maxCharacters !== undefined;
      return shouldTruncate ? truncate(nodeTitle, maxCharacters) : nodeTitle;
    }
    return removePrefixes(node['@id']);
  }
}
