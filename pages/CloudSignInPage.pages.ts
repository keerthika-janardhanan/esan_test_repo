import { Page, Locator } from '@playwright/test';
import HelperClass from '../util/methods.utility.ts';
import locators from '../locators/CloudSignInPage';

class CloudSignInPage {
  page: Page;
  helper: HelperClass;
  usernameInput: Locator;
  passwordButton: Locator;
  passwordButtonSpan: Locator;
  passwordInput: Locator;
  nextButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new HelperClass(page);
    this.usernameInput = page.locator(locators.usernameInput).first();
    this.passwordButton = page.locator(locators.passwordButton).first();
    this.passwordButtonSpan = page.locator(locators.passwordButtonSpan).first();
    this.passwordInput = page.locator(locators.passwordInput).first();
    this.nextButton = page.locator(locators.nextButton).first();
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

  async setUsernameInput(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.usernameInput.fill(finalValue);
  }

  async setPasswordInput(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.passwordInput.fill(finalValue);
  }

  async applyData(formData: Record<string, any> | null | undefined, keys?: string[], index: number = 0): Promise<void> {
    const fallbackValues: Record<string, string> = { "UsernameInput": "", "PasswordInput": "" };
    const targetKeys = Array.isArray(keys) && keys.length ? keys.map((k) => this.normaliseDataKey(k)) : null;
    const shouldHandle = (key: string) => !targetKeys || targetKeys.includes(this.normaliseDataKey(key));
    if (shouldHandle("UsernameInput")) {
      await this.setUsernameInput(this.resolveDataValue(formData, "UsernameInput", fallbackValues["UsernameInput"] ?? ''));
    }
    if (shouldHandle("PasswordInput")) {
      await this.setPasswordInput(this.resolveDataValue(formData, "PasswordInput", fallbackValues["PasswordInput"] ?? ''));
    }
  }
}

export default CloudSignInPage;