import { Routes } from '@angular/router';
import { ListNodeComponent } from './components/list-node/list-node.component';

export const routes: Routes = [
  {
    path: 'details/:id',
    component: ListNodeComponent,
  },
];
