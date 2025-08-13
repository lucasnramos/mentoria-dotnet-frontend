import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import CatalogDomainService from '@domain/catalog/catalog.domain.service';
import { CatalogDomainModel } from '@domain/catalog/catalog.model';
import { map, Observable } from 'rxjs';

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
    this.productList = this.catalogDomainService.getCatalogProductList().pipe(
      map((response: CatalogDomainModel.Response) => {
        if (response.success) {
          return response.data;
        } else {
          return [];
        }
      })
    );
  }
}
