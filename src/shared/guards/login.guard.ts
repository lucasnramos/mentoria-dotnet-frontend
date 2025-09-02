import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import IdentityDomainService from '@domain/identity/identity.domain.service';

export const loginGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const identityDomainService = inject(IdentityDomainService);

  // make shift solution here, I don't like having a catch returning true.
  try {
    const isLoggedIn = await identityDomainService.isLoggedIn();
    if (isLoggedIn) {
      router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  } catch (e) {
    return true;
  }
};
