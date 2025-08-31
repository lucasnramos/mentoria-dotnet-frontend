import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import IdentityDomainService from '@domain/identity/identity.domain.service';

export const loginGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const identityDomainService = inject(IdentityDomainService);
  const isLoggedIn = false; // TODO check logged in via SSR server

  if (isLoggedIn) {
    router.navigate(['/']);
    return false;
  } else {
    return true;
  }
};
