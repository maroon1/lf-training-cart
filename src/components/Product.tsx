import styled from '@emotion/styled';
import { App, Button, Card, Skeleton } from 'antd';
import { FC, useState } from 'react';

import { ProductDto } from '../dtos';
import { useStore } from '../store';

interface ProductProps {
  data: ProductDto;
}

export interface ProductImageProps {
  sku: number | string;
}

export const ProductImage = styled.div<ProductImageProps>((props) => {
  const image1 = './static/products/' + props.sku + '-1-product.webp';
  const image2 = './static/products/' + props.sku + '-2-product.webp';

  return {
    position: 'relative',
    paddingTop: '145.45%',
    borderRadius: '8px 8px 0 0',
    backgroundImage: `url(${image1})`,

    '&:hover': {
      backgroundImage: `url(${image2})`,
    },
  };
});

const LoadingImage = styled(Skeleton.Image)`
  width: 100% !important;
  height: 256px !important;
  border-radius: 8px 8px 0 0;

  > .ant-skeleton-image {
    width: 100%;
    height: 100%;
  }
`;

const FreeShipping = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 2px 4px;
  border-top-right-radius: 8px;
  color: #fff;
  background-color: #000;
  font-size: 12px;
`;

const Sizes = styled.div`
  position: absolute;
  bottom: 8px;
  left: 8px;
  display: flex;
`;

const Size = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  margin: 2px 2px;
  color: #fff;
  background-color: ${(props) => (props.active ? '#1677ff' : '#000')};
  font-size: 12px;
`;

export const ProductLoading = () => {
  return (
    <Card cover={<LoadingImage active />}>
      <Skeleton active />
    </Card>
  );
};

export const Product: FC<ProductProps> = (props) => {
  const { message } = App.useApp();
  const [currentSize, setSize] = useState(props.data.availableSizes[0]);
  const addProduct = useStore((state) => state.addProduct);

  const { data } = props;

  const [integer, fractional] = String(data.price.toFixed(2)).split('.');

  return (
    <Card
      className="relative"
      cover={
        <ProductImage sku={data.sku}>
          {data.isFreeShipping && <FreeShipping>包邮</FreeShipping>}
          {data.availableSizes.length > 0 && (
            <Sizes>
              {data.availableSizes.map((size) => (
                <Size
                  key={size}
                  active={currentSize === size}
                  onClick={() => {
                    setSize(size);
                  }}
                >
                  {size}
                </Size>
              ))}
            </Sizes>
          )}
        </ProductImage>
      }
    >
      <div className="flex flex-col items-center">
        <p className="h-12 overflow-hidden">Cropped Stay Groovy off white</p>
        <p>
          <span className="text-xs">{data.currencyFormat}</span>
          <span className="text-2xl font-bold">{integer}</span>
          <span className="text-base">.{fractional}</span>
        </p>
        {data.installments > 0 ? (
          <p className="text-gray-500 text-sm">
            或分 {data.installments} 期，每期
            <span className="font-bold">
              ${(data.price / data.installments).toFixed(2)}
            </span>
          </p>
        ) : (
          <div className="text-sm whitespace-pre"> </div>
        )}
        <Button
          className="mt-2"
          type="primary"
          ghost
          block
          onClick={() => {
            addProduct(data, currentSize);
            message.success(`「${data.title} - ${currentSize}」已添加到购物车`);
          }}
        >
          添加到购物车
        </Button>
      </div>
    </Card>
  );
};
