export namespace CatalogDomainModel {
  export interface Product {
    id?: string;
    name: string;
    description: string;
    price: number;
    category: string;
  }

  export interface Category {
    id?: string;
    name: string;
  }

  export type ProductList = Product[];
  export type CategoryList = Category[];
}
