import { SparqlResultWithEndpointModel } from './sparql-result-with-endpoint.model';

export interface SparqlPredObjModel extends SparqlResultWithEndpointModel {
  pred: string;
  obj: string;
}
