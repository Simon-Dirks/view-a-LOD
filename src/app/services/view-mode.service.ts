import { Injectable } from '@angular/core';
import { ViewMode } from '../models/view-mode.enum';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ViewModeService {
  current: BehaviorSubject<ViewMode> = new BehaviorSubject<ViewMode>(
    ViewMode.Grid,
  );

  constructor() {}
}
