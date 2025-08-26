import { Routes } from '@angular/router';
import { HomePage } from '@pages/home/home';
import { LoginPage } from '@pages/login/login';
import { RegisterPage } from '@pages/register/register';
import { loginGuard } from '@shared/guards/login-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => HomePage,
  },
  {
    path: 'login',
    loadComponent: () => LoginPage,
    canActivate: [loginGuard],
  },
  {
    path: 'register',
    loadComponent: () => RegisterPage,
  },
  {
    path: '**',
    loadComponent: () => HomePage,
  },
];
