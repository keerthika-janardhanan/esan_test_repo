import { Page, Locator } from '@playwright/test';
import HelperClass from '../util/methods.utility.ts';
import locators from '../locators/PaymentsOracleFusionCloudApplicationsPage';

class PaymentsOracleFusionCloudApplicationsPage {
  page: Page;
  helper: HelperClass;
  step10Element: Locator;
  submitPaymentProcessRequestButton: Locator;
  usernameInput: Locator;
  passwordButton: Locator;
  passwordButtonSpan: Locator;
  passwordInput: Locator;
  nextButton: Locator;
  step18Element: Locator;
  tasksButton: Locator;
  managePaymentProcessRequestsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new HelperClass(page);
    this.step10Element = page.locator(locators.step10Element).first();
    this.submitPaymentProcessRequestButton = page.locator(locators.submitPaymentProcessRequestButton).first();
    this.usernameInput = page.locator(locators.usernameInput).first();
    this.passwordButton = page.locator(locators.passwordButton).first();
    this.passwordButtonSpan = page.locator(locators.passwordButtonSpan).first();
    this.passwordInput = page.locator(locators.passwordInput).first();
    this.nextButton = page.locator(locators.nextButton).first();
    this.step18Element = page.locator(locators.step18Element).first();
    this.tasksButton = page.locator(locators.tasksButton).first();
    this.managePaymentProcessRequestsButton = page.locator(locators.managePaymentProcessRequestsButton).first();
  }

  private coerceValue(value: unknown): string {
    if (value === undefined || value === null) return '';
    if (typeof value === 'number') return `${value}`;
    if (typeof value === 'string') return value;
    return `${value ?? ''}`;
  }

  private normaliseDataKey(value: string): string {
    return (value || '').replace(/[^a-z0-9]+/gi, '').toLowerCase();
  }

  private resolveDataValue(formData: Record<string, any> | null | undefined, key: string, fallback: string = ''): string {
    const target = this.normaliseDataKey(key);
    if (formData) {
      for (const entryKey of Object.keys(formData)) {
        if (this.normaliseDataKey(entryKey) === target) {
          const candidate = this.coerceValue(formData[entryKey]);
          if (candidate.trim() !== '') return candidate;
        }
      }
    }
    return this.coerceValue(fallback);
  }

  async applyData(formData: Record<string, any> | null | undefined, keys?: string[], index: number = 0): Promise<void> {
    const fallbackValues: Record<string, string> = {};
    const targetKeys = Array.isArray(keys) && keys.length ? keys.map((k) => this.normaliseDataKey(k)) : null;
    const shouldHandle = (key: string) => !targetKeys || targetKeys.includes(this.normaliseDataKey(key));
  }
}

export default PaymentsOracleFusionCloudApplicationsPage;