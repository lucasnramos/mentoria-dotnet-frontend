import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CatalogDomainModel } from './catalog.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export default class CatalogDomainService {
  private url = 'http://localhost:5124/api/product';
  private http = inject(HttpClient);

  getCatalogProductList(): Observable<CatalogDomainModel.ProductList> {
    return this.http.get<CatalogDomainModel.ProductList>(this.url);
  }
}
