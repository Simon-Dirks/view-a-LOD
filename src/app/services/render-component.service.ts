import { Injectable } from '@angular/core';

import { NodeModel } from '../models/node.model';
import { Settings } from '../config/settings';
import { NodeService } from './node.service';
import {
  RenderComponentSetting,
  RenderComponentSettings,
  RenderMode,
} from '../models/settings/render-component-settings.type';

@Injectable({
  providedIn: 'root',
})
export class RenderComponentService {
  constructor(public nodes: NodeService) {}

  shouldShow(
    node: NodeModel,
    mode: RenderMode,
    renderComponentId: string,
    predicates?: string[],
  ) {
    return this.getIds(node, mode, predicates).includes(renderComponentId);
  }

  getIds(node: NodeModel, mode: RenderMode, predicates?: string[]): string[] {
    return this.getSettings(node, mode, predicates).map((r) => r.componentId);
  }

  getSettingByKey(
    settingKey: string,
    node: NodeModel,
    mode: RenderMode,
    predicates?: string[],
  ): string[] {
    const settingsByKey = this.getSettings(node, mode, predicates).map(
      (s) => s?.[settingKey],
    );
    if (!settingsByKey || settingsByKey.length === 0) {
      return [];
    }

    return settingsByKey[0];
  }

  getSettings(
    node: NodeModel,
    mode: RenderMode,
    predicates?: string[],
  ): RenderComponentSetting[] {
    if (!node) {
      return [];
    }

    const settings: RenderComponentSetting[] = [];
    let nodePreds: string[] = [];
    if (mode === RenderMode.ByType) {
      nodePreds = this.nodes.getObjValues(node, Settings.predicates.type);
    } else if (mode === RenderMode.ByPredicate) {
      nodePreds = predicates ?? [];
    }

    // TODO: Fix type error
    for (const [pred, setting] of Object.entries(
      Settings.renderComponents?.[mode] as unknown as RenderComponentSettings,
    )) {
      if (nodePreds.includes(pred)) {
        settings.push(setting);
      }
    }

    return settings;
  }

  isDefined(node: NodeModel, mode: RenderMode, predicates?: string[]): boolean {
    return (
      this.getAll(mode).filter((c) =>
        this.getIds(node, mode, predicates).includes(c.componentId),
      ).length > 0
    );
  }

  getAll(mode: RenderMode): RenderComponentSetting[] {
    // TODO: Fix type error
    return Object.values(
      Settings.renderComponents?.[mode] as unknown as RenderComponentSettings,
    );
  }
}
