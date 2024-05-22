import { Routes } from '@angular/router';
import { SearchComponent } from './components/views/search/search.component';

export const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
