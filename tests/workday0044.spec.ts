import { test } from './testSetup';
import WorkdayCollaborativePt10SignInToWorkdayPage from '../pages/WorkdayCollaborativePt10SignInToWorkdayPage.pages';
import RememberThisDeviceWorkdayAccountsPage from '../pages/RememberThisDeviceWorkdayAccountsPage.pages';
import HomeWorkdayPage from '../pages/HomeWorkdayPage.pages';
import MyOrgChartOrgViewWorkdayPage from '../pages/MyOrgChartOrgViewWorkdayPage.pages';
import ViewWorkerRobertHsingWorkdayPage from '../pages/ViewWorkerRobertHsingWorkdayPage.pages';
import { getTestToRun, shouldRun, readExcelData } from '../util/csvFileManipulation';
import { attachScreenshot, namedStep } from '../util/screenshot';

const path = require('path');
const fs = require('fs');

let executionList: any[];

test.beforeAll(() => {
  executionList = getTestToRun(path.join(__dirname, '../testmanager.xlsx'));
});

test.describe('workday0044', () => {
  let workdayCollaborativePt10SignInToWorkdayPage: WorkdayCollaborativePt10SignInToWorkdayPage;
  let rememberThisDeviceWorkdayAccountsPage: RememberThisDeviceWorkdayAccountsPage;
  let homeWorkdayPage: HomeWorkdayPage;
  let myOrgChartOrgViewWorkdayPage: MyOrgChartOrgViewWorkdayPage;
  let viewWorkerRobertHsingWorkdayPage: ViewWorkerRobertHsingWorkdayPage;

  const run = (name: string, fn: ({ page }, testinfo: any) => Promise<void>) =>
    (shouldRun(name) ? test : test.skip)(name, fn);

  run('workday0044', async ({ page }, testinfo) => {
    workdayCollaborativePt10SignInToWorkdayPage = new WorkdayCollaborativePt10SignInToWorkdayPage(page);
    rememberThisDeviceWorkdayAccountsPage = new RememberThisDeviceWorkdayAccountsPage(page);
    homeWorkdayPage = new HomeWorkdayPage(page);
    myOrgChartOrgViewWorkdayPage = new MyOrgChartOrgViewWorkdayPage(page);
    viewWorkerRobertHsingWorkdayPage = new ViewWorkerRobertHsingWorkdayPage(page);
    
    const testCaseId = testinfo.title;
    const testRow: Record<string, any> = executionList?.find((row: any) => row['TestCaseID'] === testCaseId) ?? {};
    
    const defaultDataStem = (() => {
      const core = testCaseId.replace(/[^a-z0-9]+/gi, ' ').trim();
      if (!core) return 'TestData';
      return core.split(/\s+/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    })();
    
    const defaultDatasheetName = `${defaultDataStem}Data.xlsx`;
    const defaultIdColumn = `${defaultDataStem}ID`;
    const defaultReferenceId = `${defaultDataStem}001`;
    
    const dataSheetName = String(testRow?.['DatasheetName'] ?? '').trim() || defaultDatasheetName;
    const idColumn = String(testRow?.['IDName'] ?? '').trim() || defaultIdColumn;
    const excelReferenceId = String(testRow?.['ReferenceID'] ?? '').trim() || defaultReferenceId;
    const sheetTab = String(testRow?.['SheetTab'] ?? '').trim() || 'Sheet1';
    
    const dataPath = path.join(__dirname, '../data', dataSheetName);
    
    if (!fs.existsSync(dataPath)) {
      throw new Error(`Data file not found: ${dataPath}`);
    }
    
    const dataRow = readExcelData(dataPath, sheetTab, excelReferenceId, idColumn);
    
    if (!dataRow || Object.keys(dataRow).length === 0) {
      throw new Error(`No data found for ReferenceID: ${excelReferenceId} in ${dataSheetName}`);
    }

    await namedStep('Step 0 - Navigate to application', page, testinfo, async () => {
      await page.goto('https://wd2-impl-identity.workday.com/wday/authgwy/collaborative_pt10/upc/login');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 0 - Navigate to application', testinfo, screenshot);
    });

    await namedStep('Step 1 - Enter username', page, testinfo, async () => {
      await workdayCollaborativePt10SignInToWorkdayPage.applyData(dataRow, ['usernameInput'], 0);
      const screenshot = await page.screenshot();
      attachScreenshot('Step 1 - Enter username', testinfo, screenshot);
    });

    await namedStep('Step 2 - Enter password', page, testinfo, async () => {
      await workdayCollaborativePt10SignInToWorkdayPage.applyData(dataRow, ['passwordInput'], 0);
      const screenshot = await page.screenshot();
      attachScreenshot('Step 2 - Enter password', testinfo, screenshot);
    });

    await namedStep('Step 3 - Click Sign In button', page, testinfo, async () => {
      await workdayCollaborativePt10SignInToWorkdayPage.signInButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 3 - Click Sign In button', testinfo, screenshot);
    });

    await namedStep('Step 4 - Check remember device checkbox', page, testinfo, async () => {
      await rememberThisDeviceWorkdayAccountsPage.chkrememberButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 4 - Check remember device checkbox', testinfo, screenshot);
    });

    await namedStep('Step 5 - Click Submit button', page, testinfo, async () => {
      await rememberThisDeviceWorkdayAccountsPage.submitButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 5 - Click Submit button', testinfo, screenshot);
    });

    await namedStep('Step 8 - Click My Org Chart button', page, testinfo, async () => {
      await homeWorkdayPage.myOrgChartButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 8 - Click My Org Chart button', testinfo, screenshot);
    });

    await namedStep('Step 9 - Click Robert Hsing link', page, testinfo, async () => {
      await myOrgChartOrgViewWorkdayPage.robertHsingButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 9 - Click Robert Hsing link', testinfo, screenshot);
    });

    await namedStep('Step 10 - Click San Francisco link', page, testinfo, async () => {
      await viewWorkerRobertHsingWorkdayPage.sanFranciscoButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 10 - Click San Francisco link', testinfo, screenshot);
    });
  });
});
