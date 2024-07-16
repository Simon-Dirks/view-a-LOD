import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  private drawerItemsSource = new BehaviorSubject<string[]>([]);
  drawerItems$ = this.drawerItemsSource.asObservable();

  setDrawerItems(items: string[]): void {
    this.drawerItemsSource.next(items);
  }
}
