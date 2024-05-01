import { ViewModeSetting } from './view-mode-setting.enum';
import { ViewMode } from '../view-mode.enum';

export type ViewModeSettings = {
  [v in ViewMode]: { [s in ViewModeSetting]: boolean };
};
