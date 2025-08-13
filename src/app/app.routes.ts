import { Routes } from '@angular/router';
import { HomePage } from '@pages/home/home';
import { LoginPage } from '@pages/login/login';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => HomePage,
  },
  {
    path: 'login',
    loadComponent: () => LoginPage,
  },
  {
    path: '**',
    loadComponent: () => HomePage,
  },
];
