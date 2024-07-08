import { Routes } from '@angular/router';
import { SearchComponent } from './components/views/search/search.component';
import { ColofonComponent } from './components/views/colofon/colofon.component';

export const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: SearchComponent,
  },
  {
    path: 'colofon',
    component: ColofonComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
