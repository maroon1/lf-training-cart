import { StateCreator } from 'zustand';
import { ProductDto } from '../dtos';
import { Sort } from '../services';
import { AppState } from './store';

export interface ProductState {
  sizes: string[];
  sort: Array<Sort<ProductDto>>;
  changeSizes: (sizes: string[]) => void;
  changeSort: (sort: Array<Sort<ProductDto>>) => void;
}

export const createProductStore: StateCreator<AppState, [], [], ProductState> = (
  set,
) => ({
  sizes: [],
  sort: [{ property: 'price', order: 'desc' }],
  changeSizes: (sizes: string[]) => {
    set(() => ({
      sizes,
    }));
  },
  changeSort: (sort: Array<Sort<ProductDto>>) => {
    set(() => ({
      sort,
    }));
  },
});
