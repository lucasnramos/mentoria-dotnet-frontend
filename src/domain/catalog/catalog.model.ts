export namespace CatalogDomainModel {
  export interface Product {
    id?: string;
    title: string;
    price: number;
    thumbnailUrl: string;
  }

  export interface Response {
    success: boolean;
    data: ProductList;
  }

  export type ProductList = Product[];
}
