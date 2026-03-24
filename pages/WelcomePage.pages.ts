import { Page, Locator } from '@playwright/test';
import HelperClass from '../util/methods.utility.ts';
import locators from '../locators/WelcomePage';

class WelcomePage {
  page: Page;
  helper: HelperClass;
  bidashboard172a3599biexecbindingtfiframeFieldButton: Locator;
  navigatorButton: Locator;
  payablesButton: Locator;
  paymentsButton: Locator;
  bidashboardc04de4dbiexecbindingtfiframeFieldButton: Locator;
  invoicesButton: Locator;
  bidashboarde325b95cbiexecbindingtfiframeFieldButton: Locator;
  bidashboard9a2f93e9biexecbindingtfiframeFieldButton: Locator;
  toolsButton: Locator;
  securityConsoleButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new HelperClass(page);
    this.bidashboard172a3599biexecbindingtfiframeFieldButton = page.locator(locators.bidashboard172a3599biexecbindingtfiframeFieldButton).first();
    this.navigatorButton = page.locator(locators.navigatorButton).first();
    this.payablesButton = page.locator(locators.payablesButton).first();
    this.paymentsButton = page.locator(locators.paymentsButton).first();
    this.bidashboardc04de4dbiexecbindingtfiframeFieldButton = page.locator(locators.bidashboardc04de4dbiexecbindingtfiframeFieldButton).first();
    this.bidashboarde325b95cbiexecbindingtfiframeFieldButton = page.locator(locators.bidashboarde325b95cbiexecbindingtfiframeFieldButton).first();
    this.bidashboard9a2f93e9biexecbindingtfiframeFieldButton = page.locator(locators.bidashboard9a2f93e9biexecbindingtfiframeFieldButton).first();
    this.toolsButton = page.locator(locators.toolsButton).first();
    this.securityConsoleButton = page.locator(locators.securityConsoleButton).first();
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

export default WelcomePage;