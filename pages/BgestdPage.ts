import { Page, Locator } from '@playwright/test';
import HelperClass from "../util/methods.utility.ts";
import locators from "../locators/bgestd.ts";

class Bgestdpage {
  page: Page;
  helper: HelperClass;
  close: Locator;
  close2: Locator;
  peoplesoftHcm: Locator;
  clickTheElementElement: Locator;
  submitTimesheet: Locator;
  checkAssignmentHistory: Locator;
  clickTheElementElement2: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new HelperClass(page);
    this.close = page.locator(locators.close);
    this.close2 = page.locator(locators.close2);
    this.peoplesoftHcm = page.locator(locators.peoplesoftHcm);
    this.clickTheElementElement = page.locator(locators.clickTheElementElement);
    this.submitTimesheet = page.locator(locators.submitTimesheet);
    this.checkAssignmentHistory = page.locator(locators.checkAssignmentHistory);
    this.clickTheElementElement2 = page.locator(locators.clickTheElementElement2);
  }
}

export default Bgestdpage;
