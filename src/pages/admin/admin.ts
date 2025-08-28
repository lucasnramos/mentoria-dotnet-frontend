import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AdminService } from './admin.service';

@Component({
  selector: 'app-admin-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './admin.html',
  styleUrl: './admin.scss',
})
export class AdminPage implements OnInit {
  productForm!: FormGroup;
  userForm!: FormGroup;

  private service = inject(AdminService);

  ngOnInit(): void {
    this.productForm = this.service.setupProductForm();
    this.userForm = this.service.setupUserForm();
  }

  onAddProduct() {
    // if (this.form.invalid) {
    //   console.error('Invalid user form data');
    //   return;
    // }
    // this.facade.registerUser(this.form.value);
  }

  onAddUser() {
    // if (this.form.invalid) {
    //   console.error('Invalid user form data');
    //   return;
    // }
    // this.facade.registerUser(this.form.value);
  }
}
