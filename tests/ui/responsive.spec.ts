import { test, expect } from '@playwright/test';
import { Calculator, LoginPage } from '@/pages'
import { config } from '@/config';

test.describe('Interest Calculator - Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await new LoginPage(page).login(config.loginEmail, config.loginPassword);
  });

  test.afterEach(async ({ page }) => {
    const calculator = new Calculator(page);
    if ((page.viewportSize()?.width ?? 0) <= 375) {
      await calculator.navbarToggler.click();
    }
    await calculator.logout();
  });

  test('responsive design - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    const calculator = new Calculator(page);
    await calculator.performCalculation(1000, 10, 'Yearly');
    await expect(calculator.interestAmount).toContainText('100');
    await expect(calculator.totalAmount).toContainText('1100');
  });

  test('responsive design - tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    const calculator = new Calculator(page);
    await calculator.performCalculation(1000, 10, 'Yearly');
    await expect(calculator.interestAmount).toContainText('100');
    await expect(calculator.totalAmount).toContainText('1100');
  });
});
