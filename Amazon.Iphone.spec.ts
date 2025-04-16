import { test, expect, Page } from '@playwright/test';
 
test('Search iPhone on Amazon and add to cart', async ({ page }) => {
  // 1. Navigate to Amazon
  await page.goto('https://www.amazon.com');

  // 2. Search for "iPhone"
  await page.locator('#twotabsearchtextbox').fill('iPhone');
  await page.keyboard.press('Enter');

  // 3. Click on the first product in the search results
  const firstResult = page.locator('div.s-main-slot div[data-component-type="s-search-result"] h2 a').first();
  const [newPage] = await Promise.all([
    page.waitForEvent('popup').catch(() => null),
    firstResult.click()
  ]);

  const productPage: Page = newPage ?? page;

  // 4. Retrieve the price
  const priceSelectors = ['#priceblock_ourprice', '#priceblock_dealprice', '#priceblock_saleprice'];
  let price = '';

  for (const selector of priceSelectors) {
    if (await productPage.locator(selector).isVisible()) {
      price = await productPage.locator(selector).textContent() || '';
      break;
    }
  }

  if (price.includes('₹')) {
    console.log(`📱 iPhone Price (INR): ${price}`);
  } else if (price) {
    console.log(`📱 iPhone Price: ${price} (Currency may not be INR)`);
  } else {
    console.log('Price not found.');
  }

  // 5. Add to cart
  const addToCartButton = productPage.locator('#add-to-cart-button');
  if (await addToCartButton.isVisible()) {
    await addToCartButton.click();
    console.log('iPhone added to cart successfully.');
  } else {
    console.log('Add to cart button not found.');
  }
});