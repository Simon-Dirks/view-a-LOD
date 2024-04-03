import { Injectable } from '@angular/core';
import { NodeModel, NodeObj } from '../models/node.model';
import { removePrefix } from '../helpers/util.helper';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  constructor() {}

  getObj(
    node: NodeModel | undefined,
    preds: string[],
    stripPrefix = false
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
          ? nodeObj.map((o) => removePrefix(o))
          : removePrefix(nodeObj);
        return nodeObjStripped;
      }

      return nodeObj;
    }

    return '';
  }

  getObjForAllPreds(node: NodeModel | undefined, preds: string[]): NodeObj {
    // TODO
    return 'TODO';
  }
}
