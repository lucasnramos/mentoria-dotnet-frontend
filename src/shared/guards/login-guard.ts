import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import IdentityDomainService from '@domain/identity/identity.domain.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const identityDomainService = inject(IdentityDomainService);
  const isLoggedIn = identityDomainService.isLoggedIn;

  if (isLoggedIn) {
    router.navigate(['/']);
    return false;
  } else {
    return true;
  }
};
