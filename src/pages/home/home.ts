import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CatalogDomainModel } from '@domain/catalog/catalog.model';
import { HomeService } from './home.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage implements OnInit {
  private homeService = inject(HomeService);
  productList!: Observable<CatalogDomainModel.ProductList>;

  ngOnInit(): void {
    this.productList = this.homeService.productList;
  }

  onAddCartItem(product: CatalogDomainModel.Product) {
    this.homeService.addToCart(product);
  }

  onCreateOrder() {
    this.homeService.createOrder();
  }
}
