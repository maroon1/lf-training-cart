import { App, Button, Empty, InputNumber, List } from 'antd';
import { FC, Fragment } from 'react';
import { ProductDto } from '../dtos';
import {
  ProductInCart,
  useMaxInstallments,
  useStore,
  useSubtotal,
  useTotalProducts
} from '../store';

interface ProductItemProps {
  product: ProductDto;
  amount: number;
  size: string;
}

const ProductItem: FC<ProductItemProps> = (props) => {
  const { amount, product, size } = props;

  const changeProductAmount = useStore((state) => state.changeProductAmount);

  return (
    <div className="flex items-start overflow-hidden">
      <img
        className="w-16 h-24 object-cover"
        src={`static/products/${product.sku}-1-product.webp`}
        alt=""
      />
      <div className="ml-2 flex-auto overflow-hidden">
        <h4 className="text-base overflow-hidden text-ellipsis whitespace-nowrap">
          {product.title}
        </h4>
        <div className="text-gray-500 overflow-hidden text-ellipsis whitespace-nowrap">
          {size} {product.style && <>| {product.style}</>}
        </div>
        <div>
          <span className="text-xs">{product.currencyFormat}</span>
          <span className="text-sm font-bold">{product.price.toFixed(2)}</span>
        </div>
        <div className="flex items-center">
          数量：
          <InputNumber
            className="w-14"
            value={amount}
            size="small"
            step={1}
            min={1}
            onChange={(value) => {
              if (value == null) {
                return;
              }

              changeProductAmount(product.sku.toString(), size, value);
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface ProductListProps {
  value: ProductInCart;
}

const ProductList: FC<ProductListProps> = (props) => {
  const data = Object.entries(props.value);

  const removeProduct = useStore((state) => state.removeProdcut);

  return data.length === 0 ? (
    <div className="py-8">
      <Empty description="请添加商品到购物车" />
    </div>
  ) : (
    <List>
      {data.map(([sku, item]) => (
        <Fragment key={sku}>
          {Object.entries(item).map(([size, item]) => (
            <List.Item
              key={size}
              extra={
                <Button
                  type="text"
                  danger
                  onClick={() => {
                    removeProduct(sku, size);
                  }}
                >
                  删除
                </Button>
              }
            >
              <ProductItem
                product={item.product}
                amount={item.amount}
                size={item.size}
              />
            </List.Item>
          ))}
        </Fragment>
      ))}
    </List>
  );
};

interface SubtotalProps {
  value: number;
  installments?: number;
}

const Subtotal: FC<SubtotalProps> = (props) => {
  let installments: string | undefined;

  if (props.installments) {
    installments = (props.value / props.installments).toFixed(2);
  }

  return (
    <div className="flex items-center mb-4">
      <div>小计</div>
      <div className="flex-auto text-right">
        <div className="text-lg font-bold">$ {props.value.toFixed(2)}</div>
        {installments && (
          <div className="text-s">
            或最多 <span className="text-base font-bold">$ {installments}</span>
            /月
          </div>
        )}
      </div>
    </div>
  );
};

export const Cart: FC = () => {
  const products = useStore((state) => state.products);
  const clear = useStore((state) => state.clearCart);
  const totalAmount = useTotalProducts();
  const subtotal = useSubtotal();
  const installments = useMaxInstallments();
  const { modal, message } = App.useApp();

  const onCheckout = () => {
    modal.confirm({
      title: '结算',
      content: `共 ${totalAmount} 件商品，总计 $${subtotal}，确定结算？`,
      onOk() {
        clear();
        message.success(`结算完成，共支付 $${subtotal}`)
      },
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-auto px-2 min-h-0 overflow-y-auto">
        <ProductList value={products} />
      </div>
      <div className="flex-none flex flex-col p-2 bg-gray-200">
        <Subtotal value={subtotal} installments={installments} />
        <Button type="primary" ghost block onClick={onCheckout}>
          结算
        </Button>
      </div>
    </div>
  );
};
