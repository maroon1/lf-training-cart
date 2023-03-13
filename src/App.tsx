import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge, Drawer, Layout } from 'antd';

import { Cart, Filter, ProductList, Toolbar, ToolbarItem } from './components';
import { useStore, useTotalProducts } from './store';

function App() {
  const [show, showCart] = useStore((state) => [state.show, state.showCart]);
  const total = useTotalProducts();

  return (
    <Layout>
      <Layout.Header className="z-10 sticky top-0 w-full">
        <div className="flex items-center h-full">
          <div className="text-lg text-white">江南服装厂</div>
          <Toolbar className="flex-auto">
            <ToolbarItem
              onClick={() => {
                showCart();
              }}
            >
              <Badge count={total}>
                <ShoppingCartOutlined className="text-3xl text-white align-middle" />
              </Badge>
            </ToolbarItem>
          </Toolbar>
        </div>
      </Layout.Header>
      <Layout.Content>
        <div className="flex flex-col max-w-5xl mx-auto p-4">
          <Filter />
          <ProductList />
        </div>
      </Layout.Content>
      <Drawer
        open={show}
        onClose={() => showCart(false)}
        title="购物车"
        placement="right"
        bodyStyle={{ padding: 0 }}
      >
        <Cart />
      </Drawer>
    </Layout>
  );
}

export default App;
