import { Routes } from '@angular/router';
import { SearchComponent } from './components/views/search/search.component';
import { ColofonComponent } from './components/views/colofon/colofon.component';
import { DetailsComponent } from './components/views/details/details.component';

export const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'colofon',
    component: ColofonComponent,
  },
  {
    path: 'details/:id',
    component: DetailsComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
