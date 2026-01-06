import { Page, Locator } from '@playwright/test';
import HelperClass from "../util/methods.utility.ts";
import locators from "../locators/create-invoice-payables.ts";

class Createinvoicepayablespage {
  page: Page;
  helper: HelperClass;
  clickTheElementElement: Locator;
  payables: Locator;
  invoices: Locator;
  createInvoice: Locator;
  searchBusinessUnit: Locator;
  fu01UsBu01: Locator;
  supplier: Locator;
  number: Locator;
  amount: Locator;
  expandLines: Locator;
  amount2: Locator;
  searchDistributionSet: Locator;
  officeSupplies: Locator;
  searchPaymentTerms: Locator;
  immediate: Locator;
  invoiceActions: Locator;
  validate: Locator;
  saveAndClose: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new HelperClass(page);
    this.clickTheElementElement = page.locator(locators.clickTheElementElement);
    this.payables = page.locator(locators.payables);
    this.invoices = page.locator(locators.invoices);
    this.createInvoice = page.locator(locators.createInvoice);
    this.searchBusinessUnit = page.locator(locators.searchBusinessUnit);
    this.fu01UsBu01 = page.locator(locators.fu01UsBu01);
    this.supplier = page.locator(locators.supplier);
    this.number = page.locator(locators.number);
    this.amount = page.locator(locators.amount);
    this.expandLines = page.locator(locators.expandLines);
    this.amount2 = page.locator(locators.amount2);
    this.searchDistributionSet = page.locator(locators.searchDistributionSet);
    this.officeSupplies = page.locator(locators.officeSupplies);
    this.searchPaymentTerms = page.locator(locators.searchPaymentTerms);
    this.immediate = page.locator(locators.immediate);
    this.invoiceActions = page.locator(locators.invoiceActions);
    this.validate = page.locator(locators.validate);
    this.saveAndClose = page.locator(locators.saveAndClose);
  }

  private coerceValue(value: unknown): string {
    if (value === undefined || value === null) {
      return '';
    }
    if (typeof value === 'number') {
      return `${value}`;
    }
    if (typeof value === 'string') {
      return value;
    }
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
          if (candidate.trim() !== '') {
            return candidate;
          }
        }
      }
    }
    return this.coerceValue(fallback);
  }

  async setSupplier(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.supplier.fill(finalValue);
  }

  async setNumber(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.number.fill(finalValue);
  }

  async setAmount(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.amount.fill(finalValue);
  }

  async setAmount2(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.amount2.fill(finalValue);
  }

  async applyData(formData: Record<string, any> | null | undefined, keys?: string[], index: number = 0): Promise<void> {
    const fallbackValues: Record<string, string> = {
      "Supplier": "",
      "Number": "",
      "Amount": "",
    };
    const targetKeys = Array.isArray(keys) && keys.length ? keys.map((key) => this.normaliseDataKey(key)) : null;
    const shouldHandle = (key: string) => {
      if (!targetKeys) {
        return true;
      }
      return targetKeys.includes(this.normaliseDataKey(key));
    };
    if (shouldHandle("Supplier")) {
      await this.setSupplier(this.resolveDataValue(formData, "Supplier", fallbackValues["Supplier"] ?? ''));
    }
    if (shouldHandle("Number")) {
      await this.setNumber(this.resolveDataValue(formData, "Number", fallbackValues["Number"] ?? ''));
    }
    if (shouldHandle("Amount")) {
      const value = this.resolveDataValue(formData, "Amount", fallbackValues["Amount"] ?? '');
      if (index === 0) {
        await this.setAmount(value);
      } else if (index === 1) {
        await this.setAmount2(value);
      }
    }
  }
}

export default Createinvoicepayablespage;
