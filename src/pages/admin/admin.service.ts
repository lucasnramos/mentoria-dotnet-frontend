import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class AdminService {
  setupProductForm() {
    return new FormGroup({
      title: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.min(0)]),
      thumbnailUrl: new FormControl('', [
        Validators.required,
        Validators.pattern('https?://.+'),
      ]),
    });
  }

  setupUserForm() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
      ]),
      name: new FormControl('', [Validators.required]),
      type: new FormControl(1, [Validators.required]),
    });
  }
}
