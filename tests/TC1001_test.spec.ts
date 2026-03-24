import { test } from "./testSetup";
import CloudSignInPage from "../pages/CloudSignInPage.pages";
import WelcomePage from "../pages/WelcomePage.pages";
import PaymentsOracleFusionCloudApplicationsPage from "../pages/PaymentsOracleFusionCloudApplicationsPage.pages";
import SubmitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage from "../pages/SubmitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage.pages";
import { getTestToRun, shouldRun, readExcelData } from "../util/csvFileManipulation.ts";
import { attachScreenshot, namedStep } from "../util/screenshot.ts";
import * as dotenv from 'dotenv';

const path = require('path');
const fs = require('fs');

dotenv.config();
let executionList: any[];

test.describe('TC1001_test', () => {
  let cloudSignInPage: CloudSignInPage;
  let welcomePage: WelcomePage;
  let paymentsOracleFusionCloudApplicationsPage: PaymentsOracleFusionCloudApplicationsPage;
  let submitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage: SubmitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage;

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

  run('TC1001_test', async ({ page }, testinfo) => {
    cloudSignInPage = new CloudSignInPage(page);
    welcomePage = new WelcomePage(page);
    paymentsOracleFusionCloudApplicationsPage = new PaymentsOracleFusionCloudApplicationsPage(page);
    submitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage = new SubmitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage(page);

    const testCaseId = testinfo.title;
    const testRow: Record<string, any> = executionList?.find((r: any) => r['TestCaseID'] === testCaseId) ?? {};

    const defaultDataStem = (() => {
      const core = testCaseId.replace(/[^a-z0-9]+/gi, ' ').trim();
      if (!core) return 'TestData';
      return core.split(/\s+/).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('');
    })();

    const dataSheetName    = String(testRow?.['DatasheetName'] ?? '').trim() || `${defaultDataStem}Data.xlsx`;
    const idColumn         = String(testRow?.['IDName']        ?? '').trim() || `${defaultDataStem}ID`;
    const excelReferenceId = String(testRow?.['ReferenceID']   ?? '').trim() || `${defaultDataStem}001`;
    const sheetTab         = String(testRow?.['SheetTab']      ?? '').trim() || 'Sheet1';

    const dataPath = path.join(__dirname, '../data', dataSheetName);
    if (!fs.existsSync(dataPath)) throw new Error(`Data file not found: ${dataPath}`);

    const dataRow = readExcelData(dataPath, sheetTab, excelReferenceId, idColumn);
    if (!dataRow || Object.keys(dataRow).length === 0) {
      throw new Error(`No data found for ReferenceID: ${excelReferenceId} in ${dataSheetName}`);
    }

    await namedStep('Step 0 - Navigate to application', page, testinfo, async () => {
      await page.goto('https://fa-esfe-dev19-saasfademo1.ds-fa.oraclepdemos.com');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 0 - Navigate to application', testinfo, screenshot);
    });

    await namedStep('Step 1 - Enter username', page, testinfo, async () => {
      await cloudSignInPage.setUsernameInput(dataRow['UsernameInput']);
      const screenshot = await page.screenshot();
      attachScreenshot('Step 1 - Enter username', testinfo, screenshot);
    });

    await namedStep('Step 2 - Click Password label', page, testinfo, async () => {
      await cloudSignInPage.passwordButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 2 - Click Password label', testinfo, screenshot);
    });

    await namedStep('Step 3 - Click Password span', page, testinfo, async () => {
      await cloudSignInPage.passwordButtonSpan.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 3 - Click Password span', testinfo, screenshot);
    });

    await namedStep('Step 4 - Enter password', page, testinfo, async () => {
      await cloudSignInPage.setPasswordInput(dataRow['PasswordInput']);
      const screenshot = await page.screenshot();
      attachScreenshot('Step 4 - Enter password', testinfo, screenshot);
    });

    await namedStep('Step 5 - Click Next button', page, testinfo, async () => {
      await cloudSignInPage.nextButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 5 - Click Next button', testinfo, screenshot);
    });

    await namedStep('Step 6 - Click biDashboard iframe', page, testinfo, async () => {
      await welcomePage.bidashboard172a3599biexecbindingtfiframeFieldButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 6 - Click biDashboard iframe', testinfo, screenshot);
    });

    await namedStep('Step 7 - Click Navigator', page, testinfo, async () => {
      await welcomePage.navigatorButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 7 - Click Navigator', testinfo, screenshot);
    });

    await namedStep('Step 8 - Click Payables', page, testinfo, async () => {
      await welcomePage.payablesButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 8 - Click Payables', testinfo, screenshot);
    });

    await namedStep('Step 9 - Click Payments', page, testinfo, async () => {
      await welcomePage.paymentsButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 9 - Click Payments', testinfo, screenshot);
    });

    await namedStep('Step 10 - Click Payment task element', page, testinfo, async () => {
      await paymentsOracleFusionCloudApplicationsPage.step10Element.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 10 - Click Payment task element', testinfo, screenshot);
    });

    await namedStep('Step 11 - Click Submit Payment Process Request', page, testinfo, async () => {
      await paymentsOracleFusionCloudApplicationsPage.submitPaymentProcessRequestButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 11 - Click Submit Payment Process Request', testinfo, screenshot);
    });

    await namedStep('Step 12 - Enter Name', page, testinfo, async () => {
      await submitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage.setNameInput(dataRow['NameInput']);
      const screenshot = await page.screenshot();
      attachScreenshot('Step 12 - Enter Name', testinfo, screenshot);
    });

    await namedStep('Step 13 - Enter Template', page, testinfo, async () => {
      await submitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage.setTemplateInput(dataRow['TemplateInput']);
      const screenshot = await page.screenshot();
      attachScreenshot('Step 13 - Enter Template', testinfo, screenshot);
    });

    await namedStep('Step 14 - Click UK Supplier Payment option', page, testinfo, async () => {
      await submitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage.ukSupplierPaymentButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 14 - Click UK Supplier Payment option', testinfo, screenshot);
    });

    await namedStep('Step 15 - Enter Supplier or Party', page, testinfo, async () => {
      await submitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage.setSupplierOrPartyInput(dataRow['SupplierOrPartyInput']);
      const screenshot = await page.screenshot();
      attachScreenshot('Step 15 - Enter Supplier or Party', testinfo, screenshot);
    });

    await namedStep('Step 16 - Click Dell Inc. option', page, testinfo, async () => {
      await submitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage.dellInc1255123455PayablesDisbursementsButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 16 - Click Dell Inc. option', testinfo, screenshot);
    });

    await namedStep('Step 17 - Click Submit button', page, testinfo, async () => {
      await submitPaymentProcessRequestPaymentsOracleFusionCloudApplicationsPage.submitButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 17 - Click Submit button', testinfo, screenshot);
    });
  });
});