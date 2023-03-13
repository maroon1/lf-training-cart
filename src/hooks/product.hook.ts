import { useQuery } from '@tanstack/react-query';
import { productService } from '../services';
import { useStore } from '../store';

export const useProduct = () => {
  const [sizes, sort] = useStore((state) => [state.sizes, state.sort]);

  return useQuery({
    queryKey: [
      'products',
      {
        sizes,
        sort,
      },
    ],
    queryFn: () => {
      return productService.getProducts({ sizes }, { sort });
    },
    staleTime: 5000,
  });
};
