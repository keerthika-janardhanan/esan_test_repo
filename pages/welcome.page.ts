import { Page, Locator } from "@playwright/test";
import welcomex from "../locators/welcome.ts";

class WelcomeP {
  page: Page;
  navigator: Locator;
  navigator2: Locator;
  payables: Locator;
  invoices: Locator;

  constructor(page: Page) {
    this.page = page;

    this.navigator = this.page.locator(welcomex.navigator);
    this.navigator2 = this.page.locator(welcomex.navigator2);
    this.payables = this.page.locator(welcomex.payables);
    this.invoices = this.page.locator(welcomex.invoices);
  }
  // ===== LLM GENERATED METHODS START ===== [logicalPageIndex=3] [pageTitle=Welcome]

  async navigateToInvoices() {
    await this.navigator.waitFor({ state: "visible" });
    await this.navigator.click();
    await this.navigator2.waitFor({ state: "visible" });
    await this.navigator2.click();
    await this.payables.waitFor({ state: "visible" });
    await this.payables.click();
    await this.invoices.waitFor({ state: "visible" });
    await this.invoices.click();
  }

  // ===== LLM GENERATED METHODS END ===== [logicalPageIndex=3]

}

export default WelcomeP;
