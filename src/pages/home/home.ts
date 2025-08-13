import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CatalogDomainModel } from '@domain/catalog/catalog.model';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {
  private homeFacade = inject(HomeService);
  productList = this.homeFacade.productList;

  onAddCartItem(product: CatalogDomainModel.Product) {
    this.homeFacade.addToCart(product);
  }

  onCreateOrder() {
    this.homeFacade.createOrder();
  }
}
