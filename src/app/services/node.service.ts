import { Injectable } from '@angular/core';
import { Direction, NodeModel, NodeObj } from '../models/node.model';
import { SparqlService } from './sparql.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  showingDetailsForId: BehaviorSubject<string | undefined> =
    new BehaviorSubject<string | undefined>(undefined);

  constructor(private sparql: SparqlService) {}

  get isShowingDetails(): boolean {
    return !!this.showingDetailsForId.value;
  }

  showDetails(node: NodeModel) {
    const nodeId = this.getId(node);
    this.showingDetailsForId.next(nodeId);
  }

  stopShowingDetails() {
    this.showingDetailsForId.next(undefined);
  }

  shouldShow(node: NodeModel | undefined): boolean {
    if (!node) {
      return false;
    }
    const showingDetailsForId = this.showingDetailsForId.value;
    const shouldShowAllNodes = !showingDetailsForId;
    if (shouldShowAllNodes) {
      return true;
    }

    return this.showingDetails(node);
  }

  showingDetails(node: NodeModel | undefined): boolean {
    if (!node) {
      return false;
    }

    const nodeId = this.getId(node);
    const showingDetailsForId = this.showingDetailsForId.value;
    if (!showingDetailsForId) {
      return false;
    }
    return nodeId === this.showingDetailsForId.value;
  }

  getObjs(node: NodeModel | undefined, preds: string[]): NodeObj[] {
    if (!node) {
      return [];
    }

    const objs = [];
    for (const pred of preds) {
      if (!(pred in node)) {
        continue;
      }
      for (const obj of node[pred]) {
        const noObjFoundForThisPred = !obj || obj?.value.length === 0;
        if (noObjFoundForThisPred) {
          continue;
        }

        const objValue = obj.value;
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
    direction: Direction | undefined = undefined,
    returnUniqueValues = false,
  ) {
    let objs = this.getObjs(node, preds);
    if (direction !== undefined) {
      objs = objs.filter((obj) => obj.direction === direction);
    }
    const objValues = objs.map((o) => o.value);
    return returnUniqueValues ? Array.from(new Set(objValues)) : objValues;
  }

  getObjValuesByDirection(
    node: NodeModel | undefined,
    preds: string[],
    direction: Direction,
  ) {
    return this.getObjs(node, preds)
      .filter((o) => o.direction === direction)
      .map((o) => o.value);
  }

  getId(node: NodeModel): string {
    return this.getObjValues(node, ['@id'])[0];
  }

  getEndpointId(node: NodeModel) {
    return this.getObjValues(node, ['endpointId'])[0];
  }

  getPredicates(node: NodeModel): string[] {
    return Object.keys(node);
  }

  async enrichWithIncomingRelations(nodes: NodeModel[]): Promise<NodeModel[]> {
    const promises: Promise<void>[] = [];

    for (const node of nodes) {
      const promise: Promise<void> = this.sparql
        .getIncomingRelations(node)
        .then((sparqlIncomingRelations) => {
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
      promises.push(promise);
    }

    await Promise.all(promises);

    return nodes;
  }
}
