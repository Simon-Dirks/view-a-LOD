export interface EndpointModel {
  label: string;
  endpointUrls: EndpointUrlsModel[];
}

export interface EndpointUrlsModel {
  sparql: string;
  elastic?: string;
}

export interface EndpointsModel {
  [endpointId: string]: EndpointModel;
}
