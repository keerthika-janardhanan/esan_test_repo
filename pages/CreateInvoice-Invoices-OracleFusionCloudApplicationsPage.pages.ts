import { Page, Locator } from '@playwright/test';
import HelperClass from '../util/methods.utility.ts';
import locators from '../locators/CreateInvoice-Invoices-OracleFusionCloudApplicationsPage';

class CreateInvoiceInvoicesOracleFusionCloudApplicationsPage {
  page: Page;
  helper: HelperClass;
  businessUnitInput: Locator;
  ukBusinessUnitButton: Locator;
  deInput: Locator;
  dellInc1255123455DellIncCorporationButton: Locator;
  numberInput: Locator;
  amountInput: Locator;
  expandLinesButton: Locator;
  searchDistributionSetButton: Locator;
  equipmentExpenseFullButton: Locator;
  saveButton: Locator;
  invoiceActionsButton: Locator;
  validateCtrlaltvButton: Locator;
  accountInDraftButton: Locator;
  okButton: Locator;
  postToLedgerButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new HelperClass(page);
    this.businessUnitInput = page.locator(locators.businessUnitInput).first();
    this.ukBusinessUnitButton = page.locator(locators.ukBusinessUnitButton).first();
    this.deInput = page.locator(locators.deInput).first();
    this.dellInc1255123455DellIncCorporationButton = page.locator(locators.dellInc1255123455DellIncCorporationButton).first();
    this.numberInput = page.locator(locators.numberInput).first();
    this.amountInput = page.locator(locators.amountInput).first();
    this.expandLinesButton = page.locator(locators.expandLinesButton).first();
    this.searchDistributionSetButton = page.locator(locators.searchDistributionSetButton).first();
    this.equipmentExpenseFullButton = page.locator(locators.equipmentExpenseFullButton).first();
    this.saveButton = page.locator(locators.saveButton).first();
    this.invoiceActionsButton = page.locator(locators.invoiceActionsButton).first();
    this.validateCtrlaltvButton = page.locator(locators.validateCtrlaltvButton).first();
    this.accountInDraftButton = page.locator(locators.accountInDraftButton).first();
    this.okButton = page.locator(locators.okButton).first();
    this.postToLedgerButton = page.locator(locators.postToLedgerButton).first();
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

  async setBusinessUnitInput(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.businessUnitInput.fill(finalValue);
  }

  async setDeInput(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.deInput.fill(finalValue);
  }

  async setNumberInput(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.numberInput.fill(finalValue);
  }

  async setAmountInput(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.amountInput.fill(finalValue);
  }

  async applyData(formData: Record<string, any> | null | undefined, keys?: string[], index: number = 0): Promise<void> {
    const fallbackValues: Record<string, string> = { "BusinessUnitInput": "", "DeInput": "", "NumberInput": "", "AmountInput": "" };
    const targetKeys = Array.isArray(keys) && keys.length ? keys.map((k) => this.normaliseDataKey(k)) : null;
    const shouldHandle = (key: string) => !targetKeys || targetKeys.includes(this.normaliseDataKey(key));
    if (shouldHandle("BusinessUnitInput")) {
      await this.setBusinessUnitInput(this.resolveDataValue(formData, "BusinessUnitInput", fallbackValues["BusinessUnitInput"] ?? ''));
    }
    if (shouldHandle("DeInput")) {
      await this.setDeInput(this.resolveDataValue(formData, "DeInput", fallbackValues["DeInput"] ?? ''));
    }
    if (shouldHandle("NumberInput")) {
      await this.setNumberInput(this.resolveDataValue(formData, "NumberInput", fallbackValues["NumberInput"] ?? ''));
    }
    if (shouldHandle("AmountInput")) {
      await this.setAmountInput(this.resolveDataValue(formData, "AmountInput", fallbackValues["AmountInput"] ?? ''));
    }
  }
}

export default CreateInvoiceInvoicesOracleFusionCloudApplicationsPage;
