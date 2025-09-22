import { test, expect } from '@playwright/test';
import { Calculator, LoginPage } from '@/pages'
import { config } from '@/config';
import { Duration } from '@/types';

test.describe('Interest Calculator', () => {
  test.beforeEach(async ({ page }) => {
    await new LoginPage(page).login(config.loginEmail, config.loginPassword);
  });

  test.afterEach(async ({ page }) => {
    await new Calculator(page).logout();
  });

  for (const amount of [1000, 5000, 15000]) {
    test(`can input principal amount ${amount}`, async ({ page }) => {
      const calculator = new Calculator(page);
      await calculator.setPrincipalAmount(amount);
      await expect(calculator.selectedValue).toHaveText(amount.toString());
    });
  }

  for (const rate of [1, 5, 15]) {
    test(`can select interest rate ${rate}%`, async ({ page }) => {
      const calculator = new Calculator(page);
      await calculator.selectInterestRate(rate);
      await expect(calculator.getInterestRateCheckbox(rate)).toBeChecked();
    });
  }

  for (const duration of ['Daily', 'Monthly', 'Yearly']) {
    test(`can select ${duration} duration`, async ({ page }) => {
      const calculator = new Calculator(page);
      await calculator.selectDuration(duration as Duration) ;
      await expect(calculator.getDurationOption(duration)).toHaveClass(/active/);
    });
  }

  test('complete calculation flow', async ({ page }) => {
    const calculator = new Calculator(page);
    await calculator.performCalculation(10000, 5, 'Yearly');
    
    await expect(calculator.interestAmount).not.toBeEmpty();
    await expect(calculator.totalAmount).not.toBeEmpty();
  });

  test('interest calculation accuracy', async ({ page }) => {
    const calculator = new Calculator(page);
    await calculator.performCalculation(1000, 10, 'Yearly');
    
    // 1000 * 10% = 100 interest, 1100 total
    await expect(calculator.interestAmount).toContainText('100');
    await expect(calculator.totalAmount).toContainText('1100');
  });

  test('amounts display with 2 decimal places', async ({ page }) => {
    const calculator = new Calculator(page);
    await calculator.performCalculation(1000, 3, 'Yearly');
    
    await expect(calculator.interestAmount).toContainText(/\d+\.\d{2}/);
    await expect(calculator.totalAmount).toContainText(/\d+\.\d{2}/);
  });

  test('amounts display with non-zero decimal places', async ({ page }) => {
    const calculator = new Calculator(page);
    await calculator.performCalculation(1000, 10, 'Daily');
    
    await expect(calculator.interestAmount).toContainText(/\d+\.\d{2}/);
    await expect(calculator.totalAmount).toContainText(/\d+\.\d{2}/);
  });

  test('shows alert when calculate clicked with no values', async ({ page }) => {
    const calculator = new Calculator(page);
    
    let dialogMessage = '';
    page.once('dialog', dialog => {
      dialogMessage = dialog.message();
      console.log(`Dialog message: ${dialogMessage}`);
      dialog.dismiss().catch(() => {});
    });
    
    await calculator.calculate();
    expect(dialogMessage).toBe('Please fill in all fields.');
  });

  test('shows alert when interest rate not selected', async ({ page }) => {
    const calculator = new Calculator(page);
    
    let dialogMessage = '';
    page.once('dialog', dialog => {
      dialogMessage = dialog.message();
      console.log(`Dialog message: ${dialogMessage}`);
      dialog.dismiss().catch(() => {});
    });
    
    await calculator.setPrincipalAmount(1000);
    await calculator.selectDuration('Yearly');
    await calculator.acceptConsent();
    await calculator.calculate();
    expect(dialogMessage).toBe('Please fill in all fields.');
  });


  /*
  This test fails as it seems you do not need to consent to get the intreset values out
  */
  test('shows alert when consent checkbox not checked', async ({ page }) => {
    const calculator = new Calculator(page);
    
    let dialogMessage = '';
    page.once('dialog', dialog => {
      dialogMessage = dialog.message();
      console.log(`Dialog message: ${dialogMessage}`);
      dialog.dismiss().catch(() => {});
    });
    
    await calculator.setPrincipalAmount(1000);
    await calculator.selectInterestRate(5);
    await calculator.selectDuration('Yearly');
    await calculator.calculate();
    expect(dialogMessage).toBe('Please fill in all fields.');
  });


});