import { inject, Injectable } from '@angular/core';
import CatalogDomainService from '@domain/catalog/catalog.domain.service';
import { CatalogDomainModel } from '@domain/catalog/catalog.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private catalogDomainService = inject(CatalogDomainService);
  private orderDomainService = null; // inject(OrderDomainService)
  private cartList: CatalogDomainModel.ProductList = [];

  get productList() {
    return this.catalogDomainService.getCatalogProductList().pipe(
      map((response: CatalogDomainModel.Response) => {
        if (response.success) {
          return response.data;
        } else {
          return [];
        }
      })
    );
  }

  addToCart(product: CatalogDomainModel.Product) {
    this.cartList.push(product);
  }

  createOrder() {
    console.log('order to create', this.cartList);
  }
}
