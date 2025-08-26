import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RegisterService } from './register.service';

@Component({
  selector: 'app-register-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class RegisterPage implements OnInit {
  form!: FormGroup;

  private registerService = inject(RegisterService);

  ngOnInit(): void {
    this.form = this.registerService.setupForm();
  }

  onSubmit() {
    if (this.form.invalid) {
      console.error('Invalid user form data');
      return;
    }
    this.registerService.registerUser(this.form.value);
  }
}
