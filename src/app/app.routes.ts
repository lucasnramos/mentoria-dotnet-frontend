import { Routes } from '@angular/router';
import { HomePage } from '@pages/home';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => HomePage,
  },
];
