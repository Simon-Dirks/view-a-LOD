import { Injectable } from '@angular/core';
import { ClusterValuesSettingsModel } from '../models/settings/cluster-values-settings.model';
import { TypeModel } from '../models/type.model';
import { FilterOptionValueModel } from '../models/filter-option.model';
import { Settings } from '../config/settings';

@Injectable({
  providedIn: 'root',
})
export class ClusterService {
  constructor() {}

  // TODO: Reduce overlap between cluster functions in this file, create generic cluster function?
  clusterFilterOptionValues(
    filterOptionValues: FilterOptionValueModel[],
  ): FilterOptionValueModel[] {
    if (Object.keys(Settings.clustering.filterOptionValues).length === 0) {
      return filterOptionValues;
    }

    const clusteredFilterOptionValues: {
      [clusterId: string]: FilterOptionValueModel;
    } = {};
    const nonClusteredFilterOptionValues: FilterOptionValueModel[] = [];

    for (const [clusterId, clusterSettings] of Object.entries(
      Settings.clustering.filterOptionValues as ClusterValuesSettingsModel,
    )) {
      let clusterFilterOptionValue: FilterOptionValueModel = {
        ids: [],
        label: clusterSettings.label,
        count: 0,
      };
      const existingClusterFilterOptionValue =
        clusteredFilterOptionValues[clusterId];
      if (existingClusterFilterOptionValue) {
        clusterFilterOptionValue = existingClusterFilterOptionValue;
      }

      for (const filterOptionValue of filterOptionValues) {
        const shouldBeClustered =
          filterOptionValue.ids.filter((id) =>
            clusterSettings.valueIds.includes(id),
          ).length > 0;
        if (shouldBeClustered) {
          clusterFilterOptionValue.ids = [
            ...clusterFilterOptionValue.ids,
            ...filterOptionValue.ids,
          ];
          clusterFilterOptionValue.count += filterOptionValue.count;
          clusteredFilterOptionValues[clusterId] = clusterFilterOptionValue;
        } else {
          nonClusteredFilterOptionValues.push(filterOptionValue);
        }
      }
    }

    const allFilterOptionValues = [
      ...Object.values(clusteredFilterOptionValues),
      ...nonClusteredFilterOptionValues,
    ];
    const sortedFilterOptionValues = allFilterOptionValues.sort(
      (a, b) => b.count - a.count,
    );
    return sortedFilterOptionValues;
  }

  clusterTypes(
    types: TypeModel[],
    clusters: ClusterValuesSettingsModel,
  ): TypeModel[] {
    if (Object.keys(clusters).length === 0) {
      return types;
    }

    const clusteredTypes: { [clusterId: string]: TypeModel } = {};
    let nonClusteredTypes: TypeModel[] = [];
    for (const [clusterId, cluster] of Object.entries(clusters)) {
      const typesThatShouldNotBeClustered = types.filter(
        (type) => !cluster.valueIds.includes(type.id),
      );
      nonClusteredTypes = [
        ...nonClusteredTypes,
        ...typesThatShouldNotBeClustered,
      ];
      const hasIdsToCluster =
        typesThatShouldNotBeClustered.length < types.length;
      if (hasIdsToCluster) {
        const clusteredType = {
          id: clusterId,
          label: cluster.label,
        };
        if (!(clusterId in clusteredTypes)) {
          clusteredTypes[clusterId] = clusteredType;
        }
      }
    }

    return [...nonClusteredTypes, ...Object.values(clusteredTypes)];
  }
}
