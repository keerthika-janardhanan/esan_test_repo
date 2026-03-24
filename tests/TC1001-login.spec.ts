import { Page, test } from '@playwright/test';
import * as dotenv from 'dotenv';
import CloudSignInPage from '../pages/cloudsignin.page.ts';
import WelcomePage from '../pages/welcome.page.ts';
import InvoiceWorkbenchInvoicesOracleFusionCloudApplicationsPage from '../pages/invoiceworkbenchinvoicesoraclefusioncloudapplications.page.ts';
import { getTestToRun, readExcelData, shouldRun } from '../util/csvFileManipulation.ts';
import { attachScreenshot, namedStep } from '../util/screenshot.ts';

const path = require('path');
dotenv.config();

let testData;
let executionList;

test.beforeAll(() => {
  executionList = getTestToRun(path.join(__dirname, '../testmanager.xlsx'));
});

test.describe('Tc1001 Login', () => {
  let page: Page;
  let cloudSignInPage: CloudSignInPage;
  let welcomePage: WelcomePage;
  let invoiceWorkbenchInvoicesOracleFusionCloudApplicationsPage: InvoiceWorkbenchInvoicesOracleFusionCloudApplicationsPage;

  const run = (name: string, fn: ({ page }, testinfo: any) => Promise<void>) =>
    (shouldRun(name) ? test : test.skip)(name, fn);

  run('tc1001-login', async ({ page }, testinfo) => {
    cloudSignInPage = new CloudSignInPage(page);
    welcomePage = new WelcomePage(page);
    invoiceWorkbenchInvoicesOracleFusionCloudApplicationsPage = new InvoiceWorkbenchInvoicesOracleFusionCloudApplicationsPage(page);

    let dataForTheTest = executionList.filter(r => r["TestCaseID"] === testinfo.title);
    const testCaseID = testinfo.title;

    try {
      testData = readExcelData(
        path.join(__dirname, '../data/' + dataForTheTest[0]["DatasheetName"]),
        'Sheet1',
        dataForTheTest[0]["ReferenceID"],
        dataForTheTest[0]["IDName"]
      );

      // ===== LLM GENERATED SPEC BODY START =====
      await namedStep('Navigate to Cloud Sign In', page, testinfo, async () => {
        await cloudSignInPage.goto();
        const screenshot = await page.screenshot();
        attachScreenshot('Navigate to Cloud Sign In', testinfo, screenshot);
      });

      await namedStep('Login to Cloud', page, testinfo, async () => {
        await cloudSignInPage.login(testData);
        const screenshot = await page.screenshot();
        attachScreenshot('Login to Cloud', testinfo, screenshot);
      });

      await namedStep('Click Navigator', page, testinfo, async () => {
        await welcomePage.clickNavigator();
        const screenshot = await page.screenshot();
        attachScreenshot('Click Navigator', testinfo, screenshot);
      });

      await namedStep('Navigate to Invoices', page, testinfo, async () => {
        await welcomePage.navigateToInvoices();
        const screenshot = await page.screenshot();
        attachScreenshot('Navigate to Invoices', testinfo, screenshot);
      });

      await namedStep('Open Create Invoice', page, testinfo, async () => {
        await invoiceWorkbenchInvoicesOracleFusionCloudApplicationsPage.openCreateInvoice();
        const screenshot = await page.screenshot();
        attachScreenshot('Open Create Invoice', testinfo, screenshot);
      });
      // ===== LLM GENERATED SPEC BODY END =====

    } catch (error: any) {
      console.error(`❌ [${testCaseID}] Test failed, ReferenceID will not be incremented:`, error?.message);
      throw error;
    }
  });
});
