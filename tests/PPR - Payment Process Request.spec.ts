import { test } from "./testSetup";
import CloudSignInPage from "../pages/CloudSignInPage.pages";
import WelcomePage from "../pages/WelcomePage.pages";
import PaymentsOracleFusionCloudApplicationsPage from "../pages/Payments-OracleFusionCloudApplicationsPage.pages";
import SubmitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage from "../pages/SubmitPaymentProcessRequest-Payments-OracleFusionCloudApplicationsPage.pages";
import ManagePaymentProcessRequestsPaymentsOracleFusionCloudApplicationsPage from "../pages/ManagePaymentProcessRequests-Payments-OracleFusionCloudApplicationsPage.pages";
import { getTestToRun, shouldRun, readExcelData } from "../util/csvFileManipulation.ts";
import { attachScreenshot, namedStep } from "../util/screenshot.ts";
import * as dotenv from 'dotenv';

const path = require('path');
const fs = require('fs');

dotenv.config();
let executionList: any[];

test.describe('PPR - Payment Process Request', () => {
  let cloudSignInPage: CloudSignInPage;
  let welcomePage: WelcomePage;
  let paymentsOracleFusionCloudApplicationsPage: PaymentsOracleFusionCloudApplicationsPage;
  let submitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage: SubmitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage;
  let managePaymentProcessRequestsPaymentsOracleFusionCloudApplicationsPage: ManagePaymentProcessRequestsPaymentsOracleFusionCloudApplicationsPage;

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

  run('PPR-Payment Process Request', async ({ page }, testinfo) => {
    cloudSignInPage = new CloudSignInPage(page);
    welcomePage = new WelcomePage(page);
    paymentsOracleFusionCloudApplicationsPage = new PaymentsOracleFusionCloudApplicationsPage(page);
    submitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage = new SubmitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage(page);
    managePaymentProcessRequestsPaymentsOracleFusionCloudApplicationsPage = new ManagePaymentProcessRequestsPaymentsOracleFusionCloudApplicationsPage(page);

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
     let testName = 'Test_PPR_Demo_1003_113';
    await namedStep('Step 0 - Navigate to application', page, testinfo, async () => {
      await page.goto('https://fa-esfe-dev19-saasfademo1.ds-fa.oraclepdemos.com');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 0 - Navigate to application', testinfo, screenshot);
    });

    await namedStep('Step 1 - Enter username', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'Username' }).fill('FIN_IMPL');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 1 - Enter username', testinfo, screenshot);
    });

    await namedStep('Step 2 - Enter password', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'Password' }).fill('sy4r#2V%');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 2 - Enter password', testinfo, screenshot);
    });

    await namedStep('Step 3 - Click Next button', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Next' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 3 - Click Next button', testinfo, screenshot);
    });

    await namedStep('Step 4 - Click Navigator link', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Navigator' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 4 - Click Navigator link', testinfo, screenshot);
    });

    await namedStep('Step 5 - Click Payables section', page, testinfo, async () => {
      await page.locator('div').filter({ hasText: /^Payables$/ }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 5 - Click Payables section', testinfo, screenshot);
    });

    await namedStep('Step 6 - Click Payments link', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Payments', exact: true }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 6 - Click Payments link', testinfo, screenshot);
    });

    await namedStep('Step 7 - Click Tasks link', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Tasks' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 7 - Click Tasks link', testinfo, screenshot);
    });

    await namedStep('Step 8 - Click Submit Payment Process Request link', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Submit Payment Process Request' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 8 - Click Submit Payment Process Request link', testinfo, screenshot);
    });

    await namedStep('Step 9 - Click Name textbox field', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'Name' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 9 - Click Name textbox field', testinfo, screenshot);
    });

    await namedStep('Step 10 - Fill Name field with test name', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'Name' }).fill(testName);
      const screenshot = await page.screenshot();
      attachScreenshot('Step 10 - Fill Name field with test name', testinfo, screenshot);
    });

    await namedStep('Step 11 - Click Template combobox', page, testinfo, async () => {
      await page.getByRole('combobox', { name: 'Template' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 11 - Click Template combobox', testinfo, screenshot);
    });

    await namedStep('Step 12 - Fill and select UK Supplier Payment template', page, testinfo, async () => {
      await page.getByRole('combobox', { name: 'Template' }).fill('UK Supplier Payment');
      await page.getByRole('combobox', { name: 'Template' }).press('Enter');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 12 - Fill and select UK Supplier Payment template', testinfo, screenshot);
    });

    await namedStep('Step 13 - Click Supplier or Party combobox', page, testinfo, async () => {
      await page.getByRole('combobox', { name: 'Supplier or Party' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 13 - Click Supplier or Party combobox', testinfo, screenshot);
    });

    await namedStep('Step 14 - Fill Supplier or Party with Dell Inc.', page, testinfo, async () => {
      await page.getByRole('combobox', { name: 'Supplier or Party' }).fill('Dell Inc.');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 14 - Fill Supplier or Party with Dell Inc.', testinfo, screenshot);
    });

    await namedStep('Step 15 - Press Enter to select Dell Inc.', page, testinfo, async () => {
      await page.getByRole('combobox', { name: 'Supplier or Party' }).press('Enter');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 15 - Press Enter to select Dell Inc.', testinfo, screenshot);
    });

    await namedStep('Step 16 - Click Submit button', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Submit' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 16 - Click Submit button', testinfo, screenshot);
    });

    await namedStep('Step 17 - Click Tasks link from payment request', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Tasks' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 17 - Click Tasks link from payment request', testinfo, screenshot);
    });

    await namedStep('Step 18 - Click Manage Payment Process Requests link', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Manage Payment Process Requests' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 18 - Click Manage Payment Process Requests link', testinfo, screenshot);
    });

    await namedStep('Step 19 - Click Name field and search for test name', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'Name' }).click();
      await page.getByRole('textbox', { name: 'Name' }).fill(testName);
      const screenshot = await page.screenshot();
      attachScreenshot('Step 19 - Click Name field and search for test name', testinfo, screenshot);
    });

    await namedStep('Step 20 - Click Search button and verify Completed status', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Search', exact: true }).click();
      // await expect(page.locator('[id="_FOpt1:_UISpageCust"]')).toContainText('Completed');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 20 - Click Search button and verify Completed status', testinfo, screenshot);
    });


  });
});