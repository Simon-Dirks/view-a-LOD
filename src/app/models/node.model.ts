export interface NodeModel {
  '@id': NodeObj;
  [pred: string]: NodeObj;
}

export enum Direction {
  Incoming,
  Outgoing,
}

export type NodeObj = {
  value: string[] | string;
  direction?: Direction;
};

export const nodeObjValuesAsArray = (obj: NodeObj): string[] => {
  return Array.isArray(obj.value) ? obj.value : [obj.value];
};
