import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import IdentityDomainService from '@domain/identity/identity.domain.service';
import { IdentityDomainModel } from '@domain/identity/identity.model';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginPage {
  form!: FormGroup;

  private identityDomainService = inject(IdentityDomainService);
  private mockUser: IdentityDomainModel.LoginPayload = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    password: 'poloko',
    type: 1,
  };

  ngOnInit(): void {
    this.setupForm();
  }

  onSubmit() {
    console.log('Form Submitted', this.form.value);
    if (this.form.invalid) {
      console.warn('login with mock user');
      this.identityDomainService.authenticateUser(this.mockUser);
      return;
    }
    this.identityDomainService.authenticateUser(this.form.value);
  }

  private setupForm() {
    this.form = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
      }),
      name: new FormControl('João Silva', {
        validators: [Validators.required],
      }),
      type: new FormControl(1, { validators: [Validators.required] }),
    });
  }
}
