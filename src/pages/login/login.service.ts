import { inject, Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import IdentityDomainService from '@domain/identity/identity.domain.service';
import { IdentityDomainModel } from '@domain/identity/identity.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private identityDomainService = inject(IdentityDomainService);
  private mockUser: IdentityDomainModel.LoginPayload = {
    email: 'joao.silva@email.com',
    password: 'poloko',
  };
  constructor() {}

  authenticateUser(form: FormGroup) {
    if (form.invalid) {
      console.warn('login with mock user');
      this.identityDomainService.authenticateUser(this.mockUser);
      return;
    }
    this.identityDomainService.authenticateUser(form.value);
  }
}
