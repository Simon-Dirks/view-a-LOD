import { NodeModel } from './node.model';
import { ThingWithLabelModel } from './thing-with-label.model';

export interface SearchResultsModel {
  nodes?: NodeModel[];
  typeCounts?: TypeCountsModel;
}

export type TypeCountsModel = {
  [type: string]: TypeCountModel;
};

export type TypeCountModel = {
  typeDetails: ThingWithLabelModel;
  count: number;
};
