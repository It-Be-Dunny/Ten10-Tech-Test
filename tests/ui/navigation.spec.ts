import { test, expect } from '@playwright/test';
import { LoginPage, Calculator } from '@/pages'
import { config } from '@/config';



/*
This File does not follow the POM model as i wanted to show an example of using pageContext rather than pages
as this has become poplular with tools such as playwrite/cypress and more modern fraewworks
*/

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await new LoginPage(page).login(config.loginEmail, config.loginPassword);
  });

  test.afterEach(async ({ page }) => {
    await new Calculator(page).logout();
  });

  test('can navigate to Home', async ({ page }) => {
    await page.click('a[href="/"]');
    await expect(page).toHaveURL('/');
  });

  test('can navigate to Privacy', async ({ page }) => {
    await page.click('a[href="/Home/Privacy"]');
    await expect(page).toHaveURL('/Home/Privacy');
  });

  test('can navigate to Requirements', async ({ page }) => {
    await page.click('a[href="/Home/Requirements"]');
    await expect(page).toHaveURL('/Home/Requirements');
  });

  test('can navigate to Account Management', async ({ page }) => {
    await page.click('a[href="/Account/Manage"]');
    await expect(page).toHaveURL('/Account/Manage');
    // This test will fail as there is no login button, i would expect if this was a page then the logout would still be visible
  });
});
