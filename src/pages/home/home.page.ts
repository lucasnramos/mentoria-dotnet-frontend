import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Form,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import IdentityDomainService from '@domain/identity/identity.domain.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit {
  form!: FormGroup;

  private identityDomainService = inject(IdentityDomainService);
  private mockUser = {
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
      console.error('Form is invalid');
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
