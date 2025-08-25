import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CatalogDomainModel } from './catalog.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export default class CatalogDomainService {
  private url = '/api/product';
  private http = inject(HttpClient);

  getCatalogProductList(): Observable<CatalogDomainModel.Response> {
    return this.http.get<CatalogDomainModel.Response>(this.url);
  }
}
