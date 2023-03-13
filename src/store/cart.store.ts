import { StateCreator } from 'zustand';
import { ProductDto } from '../dtos';
import { AppState, useStore } from './store';

export interface ProductInCart {
  [sku: string]: {
    product: ProductDto;
    amount: number;
  };
}

export interface CartState {
  show: boolean;
  subtotal: number;
  products: ProductInCart;
  showCart: (show?: boolean) => void;
  increase: (sku: string, amount?: number) => void;
  decrease: (sku: string, amount?: number) => void;
  changeProductAmount: (sku: string, amount: number) => void;
  addProduct: (product: ProductDto, amount?: number) => void;
  removeProdcut: (sku: string) => void;
  clearCart: () => void;
}

export const createCartSlice: StateCreator<AppState, [], [], CartState> = (
  set,
  get,
) => ({
  show: false,
  subtotal: 0,
  products: {},
  addProduct: (product, amount = 1) => {
    const inCart = get().products[product.sku];

    if (inCart) {
      get().increase(product.sku.toString());
      return;
    }

    set((state) => {
      return {
        products: {
          ...state.products,
          [product.sku]: {
            product,
            amount,
          },
        },
      };
    });
  },
  changeProductAmount: (sku: string, amount: number) => {
    const inCard = get().products[sku];

    if (!inCard) {
      return;
    }

    set((state) => {
      return {
        products: {
          ...state.products,
          [sku]: {
            product: state.products[sku].product,
            amount: amount ?? 1,
          },
        },
      };
    });
  },
  increase: (sku: string, amount = 1) => {
    const product = get().products[sku];

    if (!product) {
      return;
    }

    set((state) => {
      return {
        products: {
          ...state.products,
          [sku]: {
            product: state.products[sku].product,
            amount: state.products[sku].amount + amount,
          },
        },
      };
    });
  },
  decrease: (sku: string, amount = 1) => {
    const inCart = get().products[sku];

    if (!inCart) {
      return;
    }

    set((state) => {
      const newAmount = Math.min(1, state.products[sku].amount - amount);

      if (newAmount === 0) {
        return state;
      }

      return {
        products: {
          ...state.products,
          [sku]: {
            ...state.products[sku],
            amount: newAmount,
          },
        },
      };
    });
  },
  removeProdcut: (sku: string) => {
    set((state) => {
      delete state.products[sku];

      return {
        products: {
          ...state.products,
        },
      };
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
      acc += cur.amount;
      return acc;
    }, 0),
  );

export const useSubtotal = () =>
  useStore((state) =>
    Object.values(state.products).reduce((acc, cur) => {
      acc += cur.product.price * cur.amount;
      return acc;
    }, 0),
  );

export const useMaxInstallments = () =>
  useStore((state) =>
    Math.max(
      ...Object.values(state.products).map(
        (item) => item.product.installments ?? 0,
      ),
    ),
  );
