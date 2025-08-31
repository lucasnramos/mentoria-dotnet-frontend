import { inject, Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import CatalogDomainService from '@domain/catalog/catalog.domain.service';
import { CatalogDomainModel } from '@domain/catalog/catalog.model';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private catalogDomainService = inject(CatalogDomainService);

  setupProductForm() {
    return new FormGroup({
      title: new FormControl('Fixed value on title', [Validators.required]),
      price: new FormControl('299.99', [
        Validators.required,
        Validators.min(0),
      ]),
      thumbnailUrl: new FormControl('http://localhost/images/test.png', [
        Validators.required,
        Validators.pattern('https?://.+'),
      ]),
    });
  }

  setupUserForm() {
    return new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(100),
      ]),
      name: new FormControl('', [Validators.required]),
      type: new FormControl(1, [Validators.required]),
    });
  }

  addProduct(product: CatalogDomainModel.Product) {
    this.catalogDomainService.addProduct(product).subscribe({
      next: (addedProduct) => {
        console.log('Product added successfully:', addedProduct);
      },
      error: (error) => {
        console.error('Error adding product:', error);
      },
    });
  }
}
