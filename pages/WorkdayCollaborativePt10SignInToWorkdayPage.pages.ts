import { Page, Locator } from '@playwright/test';
import HelperClass from "../util/methods.utility";
import locators from "../locators/WorkdayCollaborativePt10SignInToWorkdayPage";

class WorkdayCollaborativePt10SignInToWorkdayPage {
  page: Page;
  helper: HelperClass;
  usernameInput: Locator;
  passwordInput: Locator;
  signInButton: Locator;
  sanFranciscoButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new HelperClass(page);
    this.usernameInput = page.locator(locators.usernameInput).first();
    this.passwordInput = page.locator(locators.passwordInput).first();
    this.signInButton = page.locator(locators.signInButton).first();
    this.sanFranciscoButton = page.locator(locators.sanFranciscoButton).first();
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
    const fallbackValues: Record<string, string> = {
      "usernameInput": "",
      "passwordInput": ""
    };
    const targetKeys = Array.isArray(keys) && keys.length ? keys.map((key) => this.normaliseDataKey(key)) : null;
    const shouldHandle = (key: string) => !targetKeys || targetKeys.includes(this.normaliseDataKey(key));
    if (shouldHandle("usernameInput")) {
      await this.setUsernameInput(this.resolveDataValue(formData, "usernameInput", fallbackValues["usernameInput"] ?? ''));
    }
    if (shouldHandle("passwordInput")) {
      await this.setPasswordInput(this.resolveDataValue(formData, "passwordInput", fallbackValues["passwordInput"] ?? ''));
    }
  }
}

export default WorkdayCollaborativePt10SignInToWorkdayPage;