import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/');
  }

  async clickLoginButton() {
    await this.page.click('.btn-secondary');
  }

  async fillUsername(username: string) {
    await this.page.fill('#UserName', username);
  }

  async fillPassword(password: string) {
    await this.page.fill('#Password', password);
  }

  async submit() {
    await this.page.click('#login-submit');
    await this.page.waitForLoadState('load');
  }

  async login(username: string, password: string) {
    await this.goto();
    await this.clickLoginButton();
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.submit();
  }
}
