import { Page, Locator } from '@playwright/test';
import HelperClass from '../util/methods.utility.ts';
import locators from '../locators/MonitorProcesses-ScheduledProcesses-OracleFusionCloudApplicationsPage';

class MonitorProcessesScheduledProcessesOracleFusionCloudApplicationsPage {
  page: Page;
  helper: HelperClass;
  scheduleNewProcessButton: Locator;
  searchNameButton: Locator;
  searchButton: Locator;
  nameInput: Locator;
  searchButton2: Locator;
  retrieveLatestLdapChangesButton: Locator;
  okButton: Locator;
  submitButton: Locator;
  closeButton: Locator;
  step37Element: Locator;
  step43Element: Locator;
  refreshButton: Locator;
  cancelButton: Locator;
  overviewSearchSavedSearchCancelableProcessesLast12HoursLast24HourButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new HelperClass(page);
    this.scheduleNewProcessButton = page.locator(locators.scheduleNewProcessButton).first();
    this.searchNameButton = page.locator(locators.searchNameButton).first();
    this.searchButton = page.locator(locators.searchButton).first();
    this.nameInput = page.locator(locators.nameInput).first();
    this.searchButton2 = page.locator(locators.searchButton2).first();
    this.retrieveLatestLdapChangesButton = page.locator(locators.retrieveLatestLdapChangesButton).first();
    this.okButton = page.locator(locators.okButton).first();
    this.submitButton = page.locator(locators.submitButton).first();
    this.closeButton = page.locator(locators.closeButton).first();
    this.step37Element = page.locator(locators.step37Element).first();
    this.step43Element = page.locator(locators.step43Element).first();
    this.refreshButton = page.locator(locators.refreshButton).first();
    this.cancelButton = page.locator(locators.cancelButton).first();
    this.overviewSearchSavedSearchCancelableProcessesLast12HoursLast24HourButton = page.locator(locators.overviewSearchSavedSearchCancelableProcessesLast12HoursLast24HourButton).first();
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

  async setNameInput(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.nameInput.fill(finalValue);
  }

  async applyData(formData: Record<string, any> | null | undefined, keys?: string[], index: number = 0): Promise<void> {
    const fallbackValues: Record<string, string> = { 'NameInput': '' };
    const targetKeys = Array.isArray(keys) && keys.length ? keys.map((k) => this.normaliseDataKey(k)) : null;
    const shouldHandle = (key: string) => !targetKeys || targetKeys.includes(this.normaliseDataKey(key));
    if (shouldHandle('NameInput')) {
      await this.setNameInput(this.resolveDataValue(formData, 'NameInput', fallbackValues['NameInput'] ?? ''));
    }
  }
}

export default MonitorProcessesScheduledProcessesOracleFusionCloudApplicationsPage;