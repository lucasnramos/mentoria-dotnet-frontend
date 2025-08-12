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
import { IdentityDomainModel } from '@domain/identity/identity.model';
import CatalogDomainService from '@domain/catalog/catalog.domain.service';
import { CatalogDomainModel } from '@domain/catalog/catalog.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss',
})
export class HomePage implements OnInit {
  form!: FormGroup;
  productList: Observable<CatalogDomainModel.ProductList> | undefined;

  private identityDomainService = inject(IdentityDomainService);
  private catalogDomainService = inject(CatalogDomainService);

  private mockUser: IdentityDomainModel.LoginPayload = {
    name: 'João Silva',
    email: 'joao.silva@email.com',
    password: 'poloko',
    type: 1,
  };

  ngOnInit(): void {
    this.setupForm();
    this.getCatalog();
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

  private getCatalog() {
    this.productList = this.catalogDomainService.getCatalogProductList();
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
