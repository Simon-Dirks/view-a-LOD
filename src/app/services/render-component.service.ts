import { Injectable } from '@angular/core';
import {
  RenderComponentSettings,
  RenderMode,
} from '../models/settings/view-component-settings.type';
import { NodeModel } from '../models/node.model';
import { Settings } from '../config/settings';
import { NodeService } from './node.service';

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
    if (!node) {
      return [];
    }

    const renderComponentIds: string[] = [];
    let nodePreds: string[] = [];
    if (mode === RenderMode.ByType) {
      nodePreds = this.nodes.getObjValues(node, Settings.predicates.type);
    } else if (mode === RenderMode.ByPredicate) {
      nodePreds = predicates ?? [];
    }

    for (const [pred, componentId] of Object.entries(
      Settings.renderComponents?.[mode] as RenderComponentSettings,
    )) {
      if (nodePreds.includes(pred)) {
        renderComponentIds.push(componentId);
      }
    }

    return renderComponentIds;
  }

  isDefined(node: NodeModel, mode: RenderMode, predicates?: string[]): boolean {
    return (
      this.getAll(mode).filter((c) =>
        this.getIds(node, mode, predicates).includes(c),
      ).length > 0
    );
  }

  getAll(mode: RenderMode): string[] {
    return Object.values(Settings.renderComponents?.[mode]);
  }
}
