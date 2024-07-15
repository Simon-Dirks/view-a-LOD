import { Component, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DrawerService } from '../../services/drawer.service';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import '@ulb-darmstadt/shacl-form';

@Component({
  selector: 'app-drawer',
  standalone: true,
  imports: [NgIcon, NgIf, CommonModule],
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DrawerComponent implements OnInit, OnDestroy {
  drawerItems: string[] = [];
  drawerSubscription: Subscription = new Subscription();
  opened = false;

  constructor(private drawerService: DrawerService) { }

  ngOnInit(): void {
    this.drawerSubscription = this.drawerService.drawerItems$.subscribe(items => {
      if (items.length > 0) {
        this.drawerItems = items;
        this.openDrawer();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.drawerSubscription) {
      this.drawerSubscription.unsubscribe();
    }
  }

  openDrawer(): void {
    this.opened = true;
  }
}



