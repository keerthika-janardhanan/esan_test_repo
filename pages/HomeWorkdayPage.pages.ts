import { Page, Locator } from '@playwright/test';
import HelperClass from "../util/methods.utility";
import locators from "../locators/HomeWorkdayPage";

class HomeWorkdayPage {
  page: Page;
  helper: HelperClass;
  wereHavingIssuesLoadingThePersonalizedContentOnYourHomepageHoweverActionsFromTheMenButton: Locator;
  myOrgChartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new HelperClass(page);
    this.wereHavingIssuesLoadingThePersonalizedContentOnYourHomepageHoweverActionsFromTheMenButton = page.locator(locators.wereHavingIssuesLoadingThePersonalizedContentOnYourHomepageHoweverActionsFromTheMenButton).first();
    this.myOrgChartButton = page.locator(locators.myOrgChartButton).first();
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
    const targetKeys = Array.isArray(keys) && keys.length ? keys.map((key) => this.normaliseDataKey(key)) : null;
    const shouldHandle = (key: string) => !targetKeys || targetKeys.includes(this.normaliseDataKey(key));
  }
}

export default HomeWorkdayPage;