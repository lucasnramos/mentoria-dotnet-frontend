import { inject, Injectable } from '@angular/core';
import CatalogDomainService from '@domain/catalog/catalog.domain.service';
import { CatalogDomainModel } from '@domain/catalog/catalog.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private catalogDomainService = inject(CatalogDomainService);
  private orderDomainService = null; // inject(OrderDomainService)
  private cartList: CatalogDomainModel.ProductList = [];
  private catalogList: Observable<CatalogDomainModel.Response>;

  constructor() {
    this.catalogList = this.catalogDomainService.getCatalogProductList();
  }

  get productList() {
    return this.catalogList.pipe(
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
