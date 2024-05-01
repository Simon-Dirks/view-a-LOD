export type RenderComponentsSettings = {
  [v in RenderMode]: RenderComponentSettings;
};

export enum RenderMode {
  ByType,
  ByPredicate,
}

export type RenderComponentSetting = {
  componentId: string;
  hopPreds?: string[];
  [key: string]: any;
};

export type RenderComponentSettings = {
  [pred: string]: RenderComponentSetting;
};
