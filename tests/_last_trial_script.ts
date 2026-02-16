import { test } from './testSetup.ts';
import WorkdayCollaborativePt10SignInToWorkdayPage from '../pages/WorkdayCollaborativePt10SignInToWorkday.pages.ts';
import RememberThisDeviceWorkdayAccountsPage from '../pages/RememberThisDeviceWorkdayAccounts.pages.ts';
import HomeWorkdayPage from '../pages/HomeWorkday.pages.ts';
import { getTestToRun, shouldRun, readExcelData } from '../util/csvFileManipulation.ts';
import { attachScreenshot, namedStep } from '../util/screenshot.ts';
import * as dotenv from 'dotenv';

const path = require('path');
const fs = require('fs');

dotenv.config();
let executionList: any[];

test.beforeAll(() => {
  executionList = getTestToRun(path.join(__dirname, '../testmanager.xlsx'));
});

test.describe('workday444', () => {
  let workdaySignInPage: WorkdayCollaborativePt10SignInToWorkdayPage;
  let rememberDevicePage: RememberThisDeviceWorkdayAccountsPage;
  let homePage: HomeWorkdayPage;

  const run = (name: string, fn: ({ page }, testinfo: any) => Promise<void>) =>
    (shouldRun(name) ? test : test.skip)(name, fn);

  run('workday444', async ({ page }, testinfo) => {
    workdaySignInPage = new WorkdayCollaborativePt10SignInToWorkdayPage(page);
    rememberDevicePage = new RememberThisDeviceWorkdayAccountsPage(page);
    homePage = new HomeWorkdayPage(page);

    const testCaseId = testinfo.title;
    console.log('[DEBUG] testCaseId:', testCaseId);
    console.log('[DEBUG] executionList:', executionList?.length, 'rows');
    const testRow: Record<string, any> = executionList?.find((row: any) => row['TestCaseID'] === testCaseId) ?? {};
    console.log('[DEBUG] testRow found:', JSON.stringify(testRow, null, 2));
    const defaultDataStem = (() => {
      const core = testCaseId.replace(/[^a-z0-9]+/gi, ' ').trim();
      if (!core) {
        return 'TestData';
      }
      return core.split(/\s+/).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join('');
    })();
    const defaultDatasheetName = `${defaultDataStem}Data.xlsx`;
    const defaultIdColumn = `${defaultDataStem}ID`;
    const defaultReferenceId = `${defaultDataStem}001`;
    const dataSheetName = String(testRow?.['DatasheetName'] ?? '').trim() || defaultDatasheetName;
    const envReferenceId = (process.env.REFERENCE_ID || process.env.DATA_REFERENCE_ID || '').trim();
    const excelReferenceId = String(testRow?.['ReferenceID'] ?? '').trim() || defaultReferenceId;
    const dataReferenceId = envReferenceId || excelReferenceId;
    // Fix: testmanager.xlsx uses 'IDName' not 'IDColumn'
    const idColumnName = String(testRow?.['IDName'] ?? testRow?.['IDColumn'] ?? '').trim() || defaultIdColumn;
    console.log('[DEBUG] Using idColumnName:', idColumnName, 'from testRow.IDName:', testRow?.['IDName']);

    const dataPath = path.join(__dirname, '../data', dataSheetName);
    let dataRow: Record<string, any> = {};
    if (fs.existsSync(dataPath)) {
      // Read all data from the Excel file
      const xlsx = require('xlsx');
      const workBook = xlsx.readFile(dataPath);
      const sheet = workBook.SheetNames[0];
      const workSheet = workBook.Sheets[sheet];
      const allData = xlsx.utils.sheet_to_json(workSheet, { defval: '' });
      console.log('[DATA] Loaded data rows:', allData.length);
      console.log('[DATA] All data:', JSON.stringify(allData, null, 2));
      console.log('[DATA] Looking for row with', idColumnName, '=', dataReferenceId, '(type:', typeof dataReferenceId, ')');
      const foundRow = allData.find((r: any) => {
        const cellValue = String(r[idColumnName] ?? '').trim();
        const searchValue = String(dataReferenceId ?? '').trim();
        console.log('[DATA] Comparing:', cellValue, '===', searchValue, '?', cellValue === searchValue);
        return cellValue === searchValue;
      });
      if (foundRow) {
        dataRow = foundRow;
        console.log('[DATA] Found matching row:', Object.keys(foundRow));
      } else {
        console.log('[DATA] No matching row found, using empty dataRow');
      }
    } else {
      console.log('[DATA] Data file not found:', dataPath);
    }

    // Validate that we have credentials before proceeding
    if (!dataRow || Object.keys(dataRow).length === 0) {
      throw new Error(`[DATA] No test data found. Please create ${dataPath} with Id=${dataReferenceId} and credentials.`);
    }

    await namedStep('Navigate to Workday Sign In', page, testinfo, async () => {
      await page.goto('https://wd2-impl-identity.workday.com/wday/authgwy/collaborative_pt10/upc/login');
      await page.waitForLoadState('networkidle');
      const screenshot = await page.screenshot();
      attachScreenshot('Navigate to Workday Sign In', testinfo, screenshot);
    });

    await namedStep('Step 1 - Input username', page, testinfo, async () => {
      await workdaySignInPage.applyData(dataRow, ['username', 'Username', 'USER'], 0);
      const screenshot = await page.screenshot();
      attachScreenshot('Step 1 - Input username', testinfo, screenshot);
    });

    await namedStep('Step 2 - Input password', page, testinfo, async () => {
      await workdaySignInPage.applyData(dataRow, ['password', 'Password', 'PASS'], 1);
      const screenshot = await page.screenshot();
      attachScreenshot('Step 2 - Input password', testinfo, screenshot);
    });

    await namedStep('Step 3 - Click Sign In', page, testinfo, async () => {
      await workdaySignInPage.clickSignIn();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 3 - Click Sign In', testinfo, screenshot);
    });

    await namedStep('Step 4 - Click chk-remember', page, testinfo, async () => {
      await rememberDevicePage.clickChkRemember();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 4 - Click chk-remember', testinfo, screenshot);
    });

    await namedStep('Step 5 - Click Submit', page, testinfo, async () => {
      await rememberDevicePage.clickSubmit();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 5 - Click Submit', testinfo, screenshot);
    });

    await namedStep('Step 6 - Click Global Navigation', page, testinfo, async () => {
      await homePage.clickGlobalNavigation();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 6 - Click Global Navigation', testinfo, screenshot);
    });

    await namedStep('Step 7 - Click element', page, testinfo, async () => {
      await page.waitForTimeout(500);
      const screenshot = await page.screenshot();
      attachScreenshot('Step 7 - Click element', testinfo, screenshot);
    });

    await namedStep('Step 8 - Click Home', page, testinfo, async () => {
      await homePage.clickHome();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 8 - Click Home', testinfo, screenshot);
    });

    await namedStep('Step 9 - Click Home', page, testinfo, async () => {
      await homePage.clickHome();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 9 - Click Home', testinfo, screenshot);
    });

    await namedStep('Step 10 - Click My Org Chart', page, testinfo, async () => {
      await homePage.clickMyOrgChart();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 10 - Click My Org Chart', testinfo, screenshot);
    });
  });
});