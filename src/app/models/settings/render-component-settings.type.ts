import { Direction } from '../node.model';
import { HopLinkSettingsModel } from './hop-link-settings.model';

export type RenderComponentsSettings = {
  [v in RenderMode]: RenderComponentSettings;
};

export enum RenderMode {
  ByType,
  ByPredicate,
}

export type RenderComponentSetting = {
  componentId: string;
  direction?: Direction;
  hopLinkSettings?: HopLinkSettingsModel;
  [key: string]: any;
};

export type RenderComponentSettings = {
  [pred: string]: RenderComponentSetting;
};
