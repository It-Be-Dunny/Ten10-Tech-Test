import { Page } from '@playwright/test';
import { Duration } from '@/types';

export class Calculator {
  constructor(private page: Page) {
  }

  get selectedValue() { return this.page.locator('#selectedValue'); }
  get interestAmount() { return this.page.locator('#interestAmount'); }
  get totalAmount() { return this.page.locator('#totalAmount'); }
  get consentCheckbox() { return this.page.locator('#gridCheck1'); }
  get form() { return this.page.locator('form'); }
  get container() { return this.page.locator('.container'); }
  get principalSlider() { return this.page.locator('#customRange1'); }
  get dropdownToggle() { return this.page.locator('.dropdown-toggle'); }
  get selectInterestRateButton() { return this.page.getByRole('button', { name: 'Select Interest Rate' }); }
  get dropdownMenu() { return this.page.locator('.dropdown-menu'); }
  get calculateButton() { return this.page.locator('.btn-primary'); }
  get requirementsLink() { return this.page.locator('a[href="/Home/Requirements"]'); }
  get logoutButton() { return this.page.locator('button:has-text("Logout")'); }
  get privacyLink() { return this.page.locator('a[href="/Home/Privacy"]'); }
  get manageLink() { return this.page.locator('a[href="/Account/Manage"]'); }
  get rateLabel() { return this.page.locator('label[for="rate-4%"]'); }
  get navbarToggler() { return this.page.locator('.navbar-toggler-icon'); }
  
  getInterestRateCheckbox(rate: number) { return this.page.locator(`#rate-${rate}\\%`); }
  getDurationOption(duration: string) { return this.page.locator(`[data-value="${duration}"]`); }

  async setPrincipalAmount(amount: number) {
    await this.principalSlider.fill(amount.toString());
  }

  async selectInterestRate(rate: number) {
    await this.selectInterestRateButton.waitFor({state: 'visible'})
    await this.dropdownToggle.click();
    await this.dropdownMenu.waitFor({ state: 'visible' });
    await this.getInterestRateCheckbox(rate).check();
    await this.rateLabel.click();
  }

  async selectDuration(duration: Duration) {
    await this.getDurationOption(duration).click();
  }

  async acceptConsent() {
    await this.consentCheckbox.check();
  }

  async calculate() {
    await this.calculateButton.click();
  }

  async performCalculation(principal: number, rate: number, duration: Duration) {
    await this.setPrincipalAmount(principal);
    await this.selectInterestRate(rate);
    await this.selectDuration(duration);
    await this.acceptConsent();
    await this.calculate();
  }

  async getInterestAmount() {
    return await this.interestAmount.textContent();
  }

  async getTotalAmount() {
    return await this.totalAmount.textContent();
  }

  async clickRequirements() {
    await this.requirementsLink.click();
  }

  async logout() {
    await this.logoutButton.click();
  }

  async navigateToPrivacy() {
    await this.privacyLink.click();
  }

  async navigateToManage() {
    await this.manageLink.click();
  }
}
