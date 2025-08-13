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
import { LoginService } from './login.service';

@Component({
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class LoginPage {
  form!: FormGroup;

  private loginService = inject(LoginService);

  ngOnInit(): void {
    this.setupForm();
  }

  onSubmit() {
    this.loginService.authenticateUser(this.form);
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
