import { Injectable, inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import IdentityDomainService from '@domain/identity/identity.domain.service';
import { IdentityDomainModel } from '@domain/identity/identity.model';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  private identityDomainService = inject(IdentityDomainService);

  registerUser(user: IdentityDomainModel.User) {
    this.identityDomainService.registerUser(user);
  }

  setupForm() {
    return new FormGroup({
      email: new FormControl('luke@r4m05.com', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('qwerty', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      name: new FormControl('Luker4m05', {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      type: new FormControl(2),
    });
  }
}
