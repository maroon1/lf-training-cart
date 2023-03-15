import { expect, Page, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000');
});

test('具有标题', async ({ page }) => {
  await expect(page).toHaveTitle('江南服装厂');
});

test.describe('商品列表', () => {
  test('添加加载状态', async ({ page }) => {
    test.expect(await page.getByTestId('loading-card').count()).toBe(8);
  });
});

test.describe('购物车', () => {
  test('点击添加到购物车后，购物车图标应当能够正确显示商品数量', async ({
    page,
  }) => {
    const addProductBtn = page.locator('.ant-btn').first();
    await addProductBtn.click();

    const cartIcon = page.getByRole('button', { name: 'shopping-cart' });

    await test.expect(cartIcon).toContainText('1');

    await addProductBtn.click();

    await test.expect(cartIcon).toContainText('2');
  });

  test('点击购物车图标应当能够展示购物车', async ({ page }) => {
    const cartIcon = page.getByRole('button', { name: 'shopping-cart' });
    await cartIcon.click();

    const cardDrawer = page.locator('.ant-drawer-mask');

    await test.expect(cardDrawer).toBeVisible();
  });

  test('点击关闭购物车图标应当能够关闭购物车', async ({ page }) => {
    const cartIcon = page.getByRole('button', { name: 'shopping-cart' });
    await cartIcon.click();

    const cartDrawer = page.locator('.ant-drawer-mask');
    await test.expect(cartDrawer).toBeVisible();

    const closeCartIcon = page.getByRole('button', { name: 'Close' });
    await closeCartIcon.click();

    await test.expect(cartDrawer).not.toBeVisible();
  });

  test('应当能够正常添加删除商品', async ({ page }) => {
    await addProductAndShowCart(page);

    const productInCart = productShouldBeInCart(page);

    const removeBtn = page.getByRole('button', { name: '删除' });
    await removeBtn.click();

    await test.expect(productInCart).not.toBeVisible();
  });

  test('一次应当只添加一件商品到购物车', async ({ page }) => {
    await addProductAndShowCart(page);

    const number = await page.locator('.ant-input-number-input').inputValue();

    test.expect(number).toBe('1');
  });

  test('应当能够修改商品数量', async ({ page }) => {
    await addProductAndShowCart(page);

    const number = page.locator('.ant-input-number-input');
    const increase = page.getByRole('button', { name: 'Increase Value' });
    const decrease = page.getByRole('button', { name: 'Decrease Value' });
    await increase.click();
    await increase.click();

    test.expect(await number.inputValue()).toBe('3');

    await decrease.click();
    test.expect(await number.inputValue()).toBe('2');

    await number.fill('10');
    test.expect(await number.inputValue()).toBe('10');
  });

  test('购物车结算的时候应当有提示', async ({ page }) => {
    await checkout(page);

    const confirmModal = page.locator('.ant-modal-content');
    await test.expect(confirmModal).toBeVisible();
  });

  test('结算窗口应当能够取消', async ({ page }) => {
    await checkout(page);

    const confirmModal = page.locator('.ant-modal-content');
    await test.expect(confirmModal).toBeVisible();

    const cancel = page.getByRole('button', { name: '取 消' });
    await cancel.click();

    await test.expect(confirmModal).not.toBeVisible();

    await productShouldBeInCart(page);
  });

  test('结算后应当清空购物车', async ({ page }) => {
    await checkout(page);
    const productInCart = await productShouldBeInCart(page);

    const confirm = page.getByRole('button', { name: '确 定' });
    await confirm.click();

    await test.expect(productInCart).not.toBeVisible();
  });
});

async function addProductAndShowCart(page: Page) {
  const addProductBtn = page.locator('.ant-btn').first();
  await addProductBtn.click();

  const cartIcon = page.getByRole('button', { name: 'shopping-cart' });
  await cartIcon.click();
}

async function checkout(page: Page) {
  await addProductAndShowCart(page);

  const checkout = page.getByRole('button', { name: '结 算' });
  await checkout.click();
}

async function productShouldBeInCart(page: Page) {
  const productInCart = page.getByTestId('cart-product');

  await test.expect(productInCart).toBeVisible();

  return productInCart;
}
