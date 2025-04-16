import { test, expect } from '@playwright/test';

test('Search Galaxy device on Amazon India and add to cart', async ({ page }) => {
  // 1. Navigate to Amazon India
  await page.goto('https://www.amazon.in');

  // 2. Search for "Galaxy"
  await page.locator('#twotabsearchtextbox').fill('Galaxy');
  await page.keyboard.press('Enter');

  // 3. Wait for search results to load and click the first product
  const firstResult = page.locator('div.s-main-slot div[data-component-type="s-search-result"] h2 a').first();
  await firstResult.waitFor({ state: 'visible' });
  await firstResult.click();

  // 4. Wait for product page to load
  await page.waitForLoadState('domcontentloaded');

  // 5. Try to retrieve the price using possible selectors
  const priceSelectors = [
    '#priceblock_ourprice',
    '#priceblock_dealprice',
    '#priceblock_saleprice',
    '#corePrice_feature_div .a-price .a-offscreen'
  ];

  let price = '';
  for (const selector of priceSelectors) {
    const locator = page.locator(selector);
    if (await locator.isVisible()) {
      price = await locator.first().textContent() || '';
      break;
    }
  }

  if (price.includes('₹')) {
    console.log(`Galaxy Device Price (INR): ${price.trim()}`);
  } else if (price) {
    console.log(`Price found: ${price.trim()} (Might not be in ₹)`);
  } else {
    console.log('Price not found.');
  }

  // 6. Add to cart
  const addToCartButton = page.locator('#add-to-cart-button');
  if (await addToCartButton.isVisible()) {
    await addToCartButton.click();
    console.log('Galaxy device added to cart successfully.');
  } else {
    console.log('Add to cart button not found.');
  }
});
