import { test } from './testSetup';
import CloudSignInPage from '../pages/CloudSignInPage.pages';
import WelcomePage from '../pages/WelcomePage.pages';
import InvoiceWorkbenchInvoicesOracleFusionCloudApplicationsPage from '../pages/InvoiceWorkbench-Invoices-OracleFusionCloudApplicationsPage.pages';
import CreateInvoiceInvoicesOracleFusionCloudApplicationsPage from '../pages/CreateInvoice-Invoices-OracleFusionCloudApplicationsPage.pages';
import { getTestToRun, shouldRun, readExcelData } from '../util/csvFileManipulation.ts';
import { attachScreenshot, namedStep } from '../util/screenshot.ts';
import * as dotenv from 'dotenv';

const path = require('path');
const fs = require('fs');

dotenv.config();
let executionList: any[];

test.describe('AP Inv Non Approval Flow New', () => {
  let cloudSignInPage: CloudSignInPage;
  let welcomePage: WelcomePage;
  let invoiceWorkbenchPage: InvoiceWorkbenchInvoicesOracleFusionCloudApplicationsPage;
  let createInvoicePage: CreateInvoiceInvoicesOracleFusionCloudApplicationsPage;

  test.beforeAll(() => {
    try {
      const testManagerPath = path.join(__dirname, '../testmanager.xlsx');
      if (fs.existsSync(testManagerPath)) {
        executionList = getTestToRun(testManagerPath);
      } else {
        console.log('[TEST MANAGER] testmanager.xlsx not found - all tests will run');
        executionList = [];
      }
    } catch (error) {
      console.warn('[TEST MANAGER] Failed to load testmanager.xlsx:', error.message);
      executionList = [];
    }
  });

  const run = (name: string, fn: ({ page }, testinfo: any) => Promise<void>) =>
    (shouldRun(name) ? test : test.skip)(name, fn);

  run('AP Inv Non Approval Flow New', async ({ page }, testinfo) => {
    cloudSignInPage = new CloudSignInPage(page);
    welcomePage = new WelcomePage(page);
    invoiceWorkbenchPage = new InvoiceWorkbenchInvoicesOracleFusionCloudApplicationsPage(page);
    createInvoicePage = new CreateInvoiceInvoicesOracleFusionCloudApplicationsPage(page);

    const testCaseId = testinfo.title;
    const testRow: Record<string, any> = executionList?.find((r: any) => r['TestCaseID'] === testCaseId) ?? {};

    const defaultDataStem = (() => {
      const core = testCaseId.replace(/[^a-z0-9]+/gi, ' ').trim();
      if (!core) return 'TestData';
      return core.split(/\s+/).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
    })();

    const dataSheetName = String(testRow?.['DatasheetName'] ?? '').trim() || `${defaultDataStem}Data.xlsx`;
    const idColumn = String(testRow?.['IDName'] ?? '').trim() || `${defaultDataStem}ID`;
    const excelReferenceId = String(testRow?.['ReferenceID'] ?? '').trim() || `${defaultDataStem}001`;
    const sheetTab = String(testRow?.['SheetTab'] ?? '').trim() || 'Sheet1';

    const dataPath = path.join(__dirname, '../data', dataSheetName);
    if (!fs.existsSync(dataPath)) throw new Error(`Data file not found: ${dataPath}`);

    const dataRow = readExcelData(dataPath, sheetTab, excelReferenceId, idColumn);
    if (!dataRow || Object.keys(dataRow).length === 0) {
      throw new Error(`No data found for ReferenceID: ${excelReferenceId} in ${dataSheetName}`);
    }

    await namedStep('Step 1 - Navigate to application', page, testinfo, async () => {
      await page.goto('https://fa-esfe-dev19-saasfademo1.ds-fa.oraclepdemos.com');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 1 - Navigate to application', testinfo, screenshot);
    });

    await namedStep('Step 2 - Enter username', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'Username' }).fill('FIN_IMPL');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 2 - Enter username', testinfo, screenshot);
    });

    await namedStep('Step 3 - Enter password', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'Password' }).fill('sy4r#2V%');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 3 - Enter password', testinfo, screenshot);
    });

    await namedStep('Step 4 - Click Next button', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Next' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 4 - Click Next button', testinfo, screenshot);
    });

    await namedStep('Step 5 - Click Navigator link', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Navigator' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 5 - Click Navigator link', testinfo, screenshot);
    });

    await namedStep('Step 6 - Click Payables section', page, testinfo, async () => {
      await page.locator('div').filter({ hasText: /^Payables$/ }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 6 - Click Payables section', testinfo, screenshot);
    });

    await namedStep('Step 7 - Click Invoices link', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Invoices' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 7 - Click Invoices link', testinfo, screenshot);
    });

    await namedStep('Step 8 - Click Tasks link', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Tasks' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 8 - Click Tasks link', testinfo, screenshot);
    });

    await namedStep('Step 9 - Click Create Invoice link', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Create Invoice', exact: true }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 9 - Click Create Invoice link', testinfo, screenshot);
    });

    await namedStep('Step 10 - Click Search Business Unit', page, testinfo, async () => {
      await page.getByTitle('Search: Business Unit').click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 10 - Click Search Business Unit', testinfo, screenshot);
    });

    await namedStep('Step 11 - Click Search link', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Search...' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 11 - Click Search link', testinfo, screenshot);
    });

    await namedStep('Step 12 - Clear and fill Name field with UK Business Unit', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'Name' }).clear();
      await page.getByRole('textbox', { name: 'Name' }).fill('UK Business Unit');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 12 - Clear and fill Name field with UK Business Unit', testinfo, screenshot);
    });

    await namedStep('Step 13 - Click Search button for Business Unit', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Search', exact: true }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 13 - Click Search button for Business Unit', testinfo, screenshot);
    });

    await namedStep('Step 14 - Select UK Business Unit and click OK', page, testinfo, async () => {
      await page.getByRole('cell', { name: 'UK Business Unit' }).nth(1).click();
      await page.getByRole('button', { name: 'OK' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 14 - Select UK Business Unit and click OK', testinfo, screenshot);
    });

    await namedStep('Step 15 - Click Search Supplier link', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Search: Supplier' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 15 - Click Search Supplier link', testinfo, screenshot);
    });

    await namedStep('Step 16 - Click Supplier textbox and fill with Dell Inc', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'Supplier', exact: true }).click();
      await page.getByRole('textbox', { name: 'Supplier', exact: true }).fill('Dell Inc');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 16 - Click Supplier textbox and fill with Dell Inc', testinfo, screenshot);
    });

    await namedStep('Step 17 - Click Search button for Supplier', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Search', exact: true }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 17 - Click Search button for Supplier', testinfo, screenshot);
    });

    await namedStep('Step 18 - Select Dell Inc and click OK', page, testinfo, async () => {
      await page.getByRole('cell', { name: 'Dell Inc.', exact: true }).click();
      await page.getByRole('button', { name: 'OK' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 18 - Select Dell Inc and click OK', testinfo, screenshot);
    });

    const invoice = "Test_demo_inv_1003_5695";
    await namedStep('Step 20 - Enter Invoice Number', page, testinfo, async () => {
      await page.locator("xpath=//input[@id=//label[normalize-space(.)='Number']/@for]").fill(invoice);
      const screenshot = await page.screenshot();
      attachScreenshot('Step 20 - Enter Invoice Number', testinfo, screenshot);
    });

    await namedStep('Step 21 - Click and fill Amount field', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'Amount' }).click();
      await page.getByRole('textbox', { name: 'Amount' }).fill('36');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 21 - Click and fill Amount field', testinfo, screenshot);
    });

    await namedStep('Step 22 - Click Expand Lines button', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Expand Lines' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 22 - Click Expand Lines button', testinfo, screenshot);
    });

    await namedStep('Step 23 - Click Amount cell', page, testinfo, async () => {
      await page.getByRole('cell', { name: 'Amount' }).getByLabel('Amount').click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 23 - Click Amount cell', testinfo, screenshot);
    });

    await namedStep('Step 24 - Fill Line Amount with 80', page, testinfo, async () => {
      await page.getByRole('row', { name: '1 Item Type Amount' }).getByLabel('Amount').fill('30');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 24 - Fill Line Amount with 80', testinfo, screenshot);
    });

    await namedStep('Step 25 - Click Search Distribution Set', page, testinfo, async () => {
      await page.getByTitle('Search: Distribution Set').click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 25 - Click Search Distribution Set', testinfo, screenshot);
    });

    await namedStep('Step 26 - Click Equipment Expense (Full)', page, testinfo, async () => {
      await page.getByText('Equipment Expense (Full)').click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 26 - Click Equipment Expense (Full)', testinfo, screenshot);
    });

    await namedStep('Step 27 - Click Save button', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Save', exact: true }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 27 - Click Save button', testinfo, screenshot);
    });

    await namedStep('Step 28 - Click Continue button', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Continue' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 28 - Click Continue button', testinfo, screenshot);
    });

    await namedStep('Step 29 - Click Invoice Actions link', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Invoice Actions' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 29 - Click Invoice Actions link', testinfo, screenshot);
    });

    await namedStep('Step 30 - Click Validate option', page, testinfo, async () => {
      await page.getByText('Validate', { exact: true }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 30 - Click Validate option', testinfo, screenshot);
    });

    await namedStep('Step 31 - Click Invoice Actions link again', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Invoice Actions' }).click();
      await page.getByRole('button', { name: 'Save and Close' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 31 - Click Invoice Actions link again', testinfo, screenshot);
    });

    await namedStep('Step 32 - Click Account in Draft option', page, testinfo, async () => {
      // await page.getByText('Account in Draft').click();
      await page.getByRole('link', { name: 'Tasks' }).click();
      await page.getByRole('link', { name: 'Manage Invoices' }).click();
      await page.getByRole('textbox', { name: 'Invoice Number' }).click();
      await page.getByRole('textbox', { name: 'Invoice Number' }).fill(invoice);
      await page.getByRole('button', { name: 'Search', exact: true }).click();

      const screenshot = await page.screenshot();
      attachScreenshot('Step 32 - Click Account in Draft option', testinfo, screenshot);
    });
  });
});
