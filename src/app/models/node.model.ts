export interface NodeModel {
  '@id': string;
  [pred: string]: NodeObj;
}

export type NodeObj = string[] | string;
