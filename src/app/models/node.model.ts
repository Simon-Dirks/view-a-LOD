export interface NodeModel {
  '@id': string;
  [pred: string]: NodeObj;
}

export type NodeObj = string[] | string;

export const nodeObjAsArray = (obj: NodeObj): string[] => {
  return Array.isArray(obj) ? obj : [obj];
};
