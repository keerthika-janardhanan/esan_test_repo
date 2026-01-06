import { Page, Locator, expect } from "@playwright/test";
import * as fs from 'fs';
import { parse } from 'csv-parse/sync';

let testData: any[];

class HelperClass {
  page: Page;
  constructor(page) {
    this.page = page;
  }
  async slowTyping(workStream: string, elementLocator: Locator) {
    for (const ch of workStream) {
      await elementLocator.press(ch);
      await this.page.waitForTimeout(100);
    }
  }
  todayDate() {
    const date = new Date()
    return date.toLocaleDateString('en-us');
  }

  //This is replaced with another implementation - NEED TO BE REMOVED
  csvToStringArray(filePath: string, testcaseId: string): any {
    const csvFile = fs.readFileSync(filePath);
    const records = parse(csvFile, {
      columns: true,
      skip_empty_lines: true,
    });
    let valueToreturn = {};
    records.forEach((record: any, index: number) => {
      console.log(`Record ${index + 1}:`);
      for (const key in record) {
        console.log(`${key}: ${record[key]}`);
        if (record[key] == testcaseId) {
          valueToreturn = record;
          break;
        }
      }
    });
    return valueToreturn;
  }

  async compoundElementSelection(locator: Locator, valuesToSelect: string) {
    await locator.click();
    let xpath = `//*[text()='${valuesToSelect}']`;
    await expect(this.page.locator(xpath)).toBeVisible();
    await this.page.locator(xpath).click();
  }

  async typeAndSelect(locator: Locator, valuesToSelect: string) {
    await this.slowTyping(valuesToSelect, locator);
    let xpath = `//*[contains(text(),'${valuesToSelect}')]`;
    await expect(this.page.locator(xpath)).toBeVisible();
    await this.page.locator(xpath).click();

  }

  async fillAndSelect(locator: Locator, valuesToSelect: string) {
    await locator.fill(valuesToSelect);
    let xpath = `//*[text()='${valuesToSelect}']`;
    await expect(this.page.locator(xpath)).toBeVisible();
    await this.page.locator(xpath).click();

  }


}
export default HelperClass;