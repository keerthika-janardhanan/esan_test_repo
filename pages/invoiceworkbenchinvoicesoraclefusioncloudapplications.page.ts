import { Page, Locator } from "@playwright/test";
import invoiceworkbenchinvoicesoraclefusioncloudapplicationsx from "../locators/invoiceworkbenchinvoicesoraclefusioncloudapplications.ts";

class InvoiceworkbenchinvoicesoraclefusioncloudapplicationsP {
  page: Page;
  invoiceworkbenchinvoicesoraclefusioncloudapplications999NOA: Locator;
  tasks: Locator;
  createInvoice: Locator;

  constructor(page: Page) {
    this.page = page;

    this.invoiceworkbenchinvoicesoraclefusioncloudapplications999NOA = this.page.locator(invoiceworkbenchinvoicesoraclefusioncloudapplicationsx.invoiceworkbenchinvoicesoraclefusioncloudapplications999NOA);
    this.tasks = this.page.locator(invoiceworkbenchinvoicesoraclefusioncloudapplicationsx.tasks);
    this.createInvoice = this.page.locator(invoiceworkbenchinvoicesoraclefusioncloudapplicationsx.createInvoice);
  }
  // ===== LLM GENERATED METHODS START ===== [logicalPageIndex=6] [pageTitle=Invoice Workbench - Invoices - Oracle Fusion Cloud Applications]

  async navigateToCreateInvoice() {
    await this.invoiceworkbenchinvoicesoraclefusioncloudapplications999NOA.waitFor({ state: "visible" });
    await this.invoiceworkbenchinvoicesoraclefusioncloudapplications999NOA.click();

    await this.tasks.waitFor({ state: "visible" });
    await this.tasks.click();

    await this.createInvoice.waitFor({ state: "visible" });
    await this.createInvoice.click();
  }

  // ===== LLM GENERATED METHODS END ===== [logicalPageIndex=6]

}

export default InvoiceworkbenchinvoicesoraclefusioncloudapplicationsP;
