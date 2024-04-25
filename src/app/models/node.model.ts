export interface NodeModel {
  '@id': NodeObj[];
  [pred: string]: NodeObj[];
}

export enum Direction {
  Incoming,
  Outgoing,
}

export type NodeObj = {
  value: string;
  direction?: Direction;
};
