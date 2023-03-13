import { ProductDto } from '../dtos';
import { randomRange } from '../utils';
import data from './products.json';

export interface Sort<T> {
  property: keyof T;
  order: 'asc' | 'desc';
}

export interface PageRequest<T> {
  page?: number;
  limit?: number;
  sort?: Array<Sort<T>>;
}

export interface ProductQuery {
  sizes?: string[];
}

export type ProductFilter = ProductQuery & PageRequest<ProductDto>;

export class ProductService {
  getProducts(
    query?: ProductQuery,
    pageable?: PageRequest<ProductDto>,
  ): Promise<ProductDto[]> {
    return new Promise<ProductDto[]>((resolve) => {
      let products = [...data.data.products];

      if (query?.sizes?.length) {
        products = products.filter((item) => {
          return item.availableSizes.some((size) =>
            query.sizes?.includes(size),
          );
        });
      }

      if (pageable?.sort) {
        pageable.sort.forEach((sort) => {
          products.sort((a, b) => {
            let result = a[sort.property] >= b[sort.property] ? 1 : -1;

            const order = sort.order === 'asc' ? 1 : -1;

            return result * order;
          });
        });
      }

      setTimeout(() => {
        resolve(products);
      }, randomRange(250, 1000));
    });
  }
}

export const productService = new ProductService();
