import { Routes } from '@angular/router';
import { SearchComponent } from './components/views/search/search.component';
import { DetailsComponent } from './components/views/details/details.component';

export const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    pathMatch: 'full',
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
