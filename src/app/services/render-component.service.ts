import { Injectable } from '@angular/core';

import { Direction, NodeModel } from '../models/node.model';
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
    direction?: Direction,
  ) {
    return this.getIds(node, mode, predicates, direction).includes(
      renderComponentId,
    );
  }

  getIds(
    node: NodeModel,
    mode: RenderMode,
    predicates?: string[],
    direction?: Direction,
  ): string[] {
    return this.getSettings(node, mode, predicates, direction).map(
      (r) => r.componentId,
    );
  }

  getSettingByKey(
    settingKey: string,
    node: NodeModel,
    mode: RenderMode,
    predicates?: string[],
    direction?: Direction,
  ): string[] {
    const settingsByKey = this.getSettings(
      node,
      mode,
      predicates,
      direction,
    ).map((s) => s?.[settingKey]);
    if (!settingsByKey || settingsByKey.length === 0) {
      return [];
    }

    return settingsByKey[0];
  }

  getSettings(
    node: NodeModel,
    mode: RenderMode,
    predicates?: string[],
    direction?: Direction,
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
      const matchesDirection =
        direction === undefined || direction === setting.direction;
      if (nodePreds.includes(pred) && matchesDirection) {
        settings.push(setting);
      }
    }

    return settings;
  }

  isDefined(
    node: NodeModel,
    mode: RenderMode,
    predicates?: string[],
    direction?: Direction,
  ): boolean {
    return (
      this.getAll(mode).filter((c) =>
        this.getIds(node, mode, predicates, direction).includes(c.componentId),
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
