import { Routes } from '@angular/router';
import { HomePage } from '@pages/home/home';
import { LoginPage } from '@pages/login/login';
import { identityInterceptor } from '@shared/interceptors/identity-interceptor';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => HomePage,
  },
  {
    path: 'login',
    loadComponent: () => LoginPage,
    canActivate: [identityInterceptor],
  },
  {
    path: '**',
    loadComponent: () => HomePage,
  },
];
