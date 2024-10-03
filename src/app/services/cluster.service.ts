import { Injectable } from '@angular/core';
import { ClusterValuesSettingsModel } from '../models/settings/cluster-values-settings.model';
import { TypeModel } from '../models/type.model';
import { FilterOptionValueModel } from '../models/filter-option.model';
import { Settings } from '../config/settings';
import { intersects } from '../helpers/util.helper';

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

    const allValueIdsToCluster = Object.values(
      Settings.clustering.filterOptionValues as ClusterValuesSettingsModel,
    ).flatMap((v) => v.valueIds);
    const nonClusteredFilterOptionValues: FilterOptionValueModel[] =
      filterOptionValues.filter(
        (optionValue) => !intersects(optionValue.ids, allValueIdsToCluster),
      );

    for (const [clusterId, clusterSettings] of Object.entries(
      Settings.clustering.filterOptionValues as ClusterValuesSettingsModel,
    )) {
      let clusterFilterOptionValue: FilterOptionValueModel = {
        ids: [],
        label: clusterSettings.label,
        filterHitIds: [],
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
            ...new Set([
              ...clusterFilterOptionValue.ids,
              ...clusterSettings.valueIds,
              ...filterOptionValue.ids,
            ]),
          ];

          const uniqueFilterHitIds = Array.from(
            new Set(
              clusterFilterOptionValue.filterHitIds.concat(
                filterOptionValue.filterHitIds,
              ),
            ),
          );
          clusterFilterOptionValue.filterHitIds = uniqueFilterHitIds;

          clusteredFilterOptionValues[clusterId] = clusterFilterOptionValue;
        }
      }
    }

    const allFilterOptionValues = [
      ...Object.values(clusteredFilterOptionValues),
      ...nonClusteredFilterOptionValues,
    ];
    const sortedFilterOptionValues = allFilterOptionValues.sort(
      (a, b) => b.filterHitIds.length - a.filterHitIds.length,
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
    const nonClusteredTypes: TypeModel[] = [];
    const processedTypes = new Set<string>();

    for (const [clusterId, cluster] of Object.entries(clusters)) {
      const typesToBeClustered = types.filter((type) =>
        cluster.valueIds.includes(type.id),
      );

      if (typesToBeClustered.length > 0) {
        const clusteredType = {
          id: clusterId,
          label: cluster.label,
        };
        clusteredTypes[clusterId] = clusteredType;
        typesToBeClustered.forEach((type) => processedTypes.add(type.id));
      }
    }

    types.forEach((type) => {
      if (!processedTypes.has(type.id)) {
        nonClusteredTypes.push(type);
      }
    });

    return [...nonClusteredTypes, ...Object.values(clusteredTypes)];
  }
}
