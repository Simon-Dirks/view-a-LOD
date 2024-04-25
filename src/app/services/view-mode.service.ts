import { Injectable } from '@angular/core';
import { ViewMode } from '../models/view-mode.enum';

@Injectable({
  providedIn: 'root',
})
export class ViewModeService {
  current: ViewMode = ViewMode.List;

  constructor() {}
}
