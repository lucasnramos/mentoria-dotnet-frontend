import { inject, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IdentityDomainService from '@domain/identity/identity.domain.service';
import { IdentityDomainModel } from '@domain/identity/identity.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
  private identityDomainService = inject(IdentityDomainService);

  authenticateUser(form: FormGroup) {
    this.identityDomainService.authenticateUser(form.value);
  }

  setupForm() {
    return new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
    });
  }
}
