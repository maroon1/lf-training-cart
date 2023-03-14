import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { StateCreator } from 'zustand';
import { ProductDto } from '../dtos';
import { Sort } from '../services';

export interface ProductState {
  sizes: string[];
  sort: Array<Sort<ProductDto>>;
  changeSizes: (sizes: string[]) => void;
  changeSort: (sort: Array<Sort<ProductDto>>) => void;
}

export const createProductStore: StateCreator<
  AppState,
  [],
  [],
  ProductState
> = (set) => ({
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

export interface ProductInCart {
  [sku: string]: {
    [size: string]: {
      product: ProductDto;
      size: string;
      amount: number;
    };
  };
}

export interface CartState {
  show: boolean;
  subtotal: number;
  products: ProductInCart;
  showCart: (show?: boolean) => void;
  increase: (sku: string, size: string, amount?: number) => void;
  decrease: (sku: string, size: string, amount?: number) => void;
  changeProductAmount: (sku: string, size: string, amount: number) => void;
  addProduct: (product: ProductDto, size: string, amount?: number) => void;
  removeProdcut: (sku: string, size: string) => void;
  clearCart: () => void;
}

export const createCartSlice: StateCreator<AppState, [], [], CartState> = (
  set,
  get,
) => ({
  show: false,
  subtotal: 0,
  products: {},
  addProduct: (product, size, amount = 1) => {
    const productInCart = get().products[product.sku]?.[size];

    if (productInCart) {
      get().increase(product.sku.toString(), size);
      return;
    }

    set((state) => {
      state.products[product.sku] ??= {};
      state.products[product.sku][size] = {
        amount,
        product,
        size,
      };

      return state;
    });
  },
  changeProductAmount: (sku: string, size: string, amount: number) => {
    const inCard = get().products[sku]?.[size];

    if (!inCard) {
      return;
    }

    set((state) => {
      state.products[sku][size].amount = amount;
      return state;
    });
  },
  increase: (sku, size, amount = 1) => {
    const product = get().products[sku]?.[size];

    if (!product) {
      return;
    }

    set((state) => {
      state.products[sku][size].amount += amount;

      return state;
    });
  },
  decrease: (sku, size, amount = 1) => {
    const inCart = get().products[sku];

    if (!inCart) {
      return;
    }

    set((state) => {
      const newAmount = Math.min(1, state.products[sku][size].amount - amount);

      if (newAmount === 0) {
        return state;
      }

      state.products[sku][size].amount = newAmount;

      return state;
    });
  },
  removeProdcut: (sku, size) => {
    set((state) => {
      if (state.products[sku]?.[size]) {
        delete state.products[sku][size];
      }

      return state;
    });
  },
  clearCart: () => {
    set(() => {
      return {
        products: {},
      };
    });
  },
  showCart: (show = true) => {
    set({ show });
  },
});

export const useTotalProducts = () =>
  useStore((state) =>
    Object.values(state.products).reduce((acc, cur) => {
      acc += Object.values(cur).reduce((acc, cur) => {
        acc += cur.amount;

        return acc;
      }, 0);
      return acc;
    }, 0),
  );

export const useSubtotal = () =>
  useStore((state) =>
    Object.values(state.products).reduce((acc, cur) => {
      acc += Object.values(cur).reduce((acc, cur) => {
        acc += cur.product.price * cur.amount;

        return acc;
      }, 0);

      return acc;
    }, 0),
  );

export const useMaxInstallments = () =>
  useStore((state) =>
    Math.max(
      ...Object.values(state.products).flatMap((item) =>
        Object.values(item).map(
          (innerItem) => innerItem.product.installments ?? 0,
        ),
      ),
    ),
  );

export type AppState = CartState & ProductState;

export const useStore = create<
  AppState,
  [['zustand/persist', AppState], ['zustand/immer', AppState]]
>(
  persist(
    immer((...a) => ({
      ...createCartSlice(...a),
      ...createProductStore(...a),
    })),
    { name: 'cart-store' },
  ),
);
