import { Injectable } from '@angular/core';
import { TypeCountsModel } from '../../models/search-results.model';
import { estypes } from '@elastic/elasticsearch';
import { NodeModel } from '../../models/node.model';
import { replacePrefixes } from '../../helpers/util.helper';

@Injectable({
  providedIn: 'root',
})
export class TypeCountsService {
  constructor() {}

  private _merge(typeCountsList: TypeCountsModel[]): TypeCountsModel {
    const typeCountsMerged: TypeCountsModel = {};
    for (const typeCounts of typeCountsList) {
      for (const [type, typeCount] of Object.entries(typeCounts)) {
        if (type in typeCountsMerged) {
          typeCountsMerged[type].count += typeCount.count;
        } else {
          typeCountsMerged[type] = typeCount;
        }
      }
    }
    return typeCountsMerged;
  }

  getFromSearchResponses(
    searchResponses: estypes.SearchResponse<NodeModel>[],
  ): TypeCountsModel {
    const typeCountsForEndpoints: TypeCountsModel[] = searchResponses.map(
      (response) => this.getFromSearchResponse(response),
    );
    return this._merge(typeCountsForEndpoints);
  }

  getFromSearchResponse(
    searchResponse: estypes.SearchResponse<NodeModel>,
  ): TypeCountsModel {
    const aggregations: any = searchResponse?.aggregations;
    const buckets: { key: string; doc_count: string }[] =
      aggregations?.['rdf_types']?.buckets;
    const typeCounts: TypeCountsModel = {};
    buckets.forEach((bucket) => {
      const typeId = bucket.key;
      typeCounts[typeId] = {
        typeDetails: {
          label: replacePrefixes(typeId),
          '@id': typeId,
        },
        count: Number(bucket.doc_count),
      };
    });
    return typeCounts;
  }
}
