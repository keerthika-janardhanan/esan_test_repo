import { Page, Locator } from '@playwright/test';
import HelperClass from '../util/methods.utility.ts';
import locators from '../locators/SubmitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage';

class SubmitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage {
  page: Page;
  helper: HelperClass;
  nameInput: Locator;
  templateInput: Locator;
  ukSupplierPaymentButton: Locator;
  supplierOrPartyInput: Locator;
  dellInc1255123455PayablesDisbursementsButton: Locator;
  submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new HelperClass(page);
    this.nameInput = page.locator(locators.nameInput).first();
    this.templateInput = page.locator(locators.templateInput).first();
    this.ukSupplierPaymentButton = page.locator(locators.ukSupplierPaymentButton).first();
    this.supplierOrPartyInput = page.locator(locators.supplierOrPartyInput).first();
    this.dellInc1255123455PayablesDisbursementsButton = page.locator(locators.dellInc1255123455PayablesDisbursementsButton).first();
    this.submitButton = page.locator(locators.submitButton).first();
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

  async setTemplateInput(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.templateInput.fill(finalValue);
  }

  async setSupplierOrPartyInput(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.supplierOrPartyInput.fill(finalValue);
  }

  async applyData(formData: Record<string, any> | null | undefined, keys?: string[], index: number = 0): Promise<void> {
    const fallbackValues: Record<string, string> = { "NameInput": "", "TemplateInput": "", "SupplierOrPartyInput": "" };
    const targetKeys = Array.isArray(keys) && keys.length ? keys.map((k) => this.normaliseDataKey(k)) : null;
    const shouldHandle = (key: string) => !targetKeys || targetKeys.includes(this.normaliseDataKey(key));
    if (shouldHandle("NameInput")) {
      await this.setNameInput(this.resolveDataValue(formData, "NameInput", fallbackValues["NameInput"] ?? ''));
    }
    if (shouldHandle("TemplateInput")) {
      await this.setTemplateInput(this.resolveDataValue(formData, "TemplateInput", fallbackValues["TemplateInput"] ?? ''));
    }
    if (shouldHandle("SupplierOrPartyInput")) {
      await this.setSupplierOrPartyInput(this.resolveDataValue(formData, "SupplierOrPartyInput", fallbackValues["SupplierOrPartyInput"] ?? ''));
    }
  }
}

export default SubmitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage;