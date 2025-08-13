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
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage implements OnInit {
  productList: Observable<CatalogDomainModel.ProductList> | undefined;

  private catalogDomainService = inject(CatalogDomainService);

  ngOnInit(): void {
    this.getCatalog();
  }

  private getCatalog() {
    this.productList = this.catalogDomainService.getCatalogProductList();
  }
}
