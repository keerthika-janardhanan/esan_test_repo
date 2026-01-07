import { test } from "./testSetup.ts";
import PageObject from "../pages/BgestdPage.ts";
import { getTestToRun, shouldRun, readExcelData } from "../util/csvFileManipulation.ts";
import { attachScreenshot, namedStep } from "../util/screenshot.ts";
import * as dotenv from 'dotenv';

const path = require('path');
const fs = require('fs');

dotenv.config();
let executionList: any[];

test.beforeAll(() => {
  executionList = getTestToRun(path.join(__dirname, '../testmanager.xlsx'));
});

test.describe("bgestd", () => {
  let bgestdpage: PageObject;

  const run = (name: string, fn: ({ page }, testinfo: any) => Promise<void>) =>
    (shouldRun(name) ? test : test.skip)(name, fn);

  run("bgestd", async ({ page }, testinfo) => {
    bgestdpage = new PageObject(page);
    const testCaseId = testinfo.title;
    const testRow: Record<string, any> = executionList?.find((row: any) => row['TestCaseID'] === testCaseId) ?? {};
    // Only use defaults if DatasheetName is explicitly provided (not empty)
    const datasheetFromExcel = String(testRow?.['DatasheetName'] ?? '').trim();
    const dataSheetName = datasheetFromExcel || '';
    const envReferenceId = (process.env.REFERENCE_ID || process.env.DATA_REFERENCE_ID || '').trim();
    const excelReferenceId = String(testRow?.['ReferenceID'] ?? '').trim();
    const dataReferenceId = envReferenceId || excelReferenceId;
    if (dataReferenceId) {
      console.log(`[ReferenceID] Using: ${dataReferenceId} (source: ${envReferenceId ? 'env' : 'excel'})`);
    }
    const dataIdColumn = String(testRow?.['IDName'] ?? '').trim();
    const dataSheetTab = String(testRow?.['SheetName'] ?? testRow?.['Sheet'] ?? '').trim();
    const dataDir = path.join(__dirname, '../data');
    fs.mkdirSync(dataDir, { recursive: true });
    let dataRow: Record<string, any> = {};
    const ensureDataFile = (): string | null => {
      if (!dataSheetName) {
        // No datasheet configured - skip data loading (optional datasheet)
        return null;
      }
      const expectedPath = path.join(dataDir, dataSheetName);
      if (!fs.existsSync(expectedPath)) {
        const caseInsensitiveMatch = (() => {
          try {
            const entries = fs.readdirSync(dataDir, { withFileTypes: false });
            const target = dataSheetName.toLowerCase();
            const found = entries.find((entry) => entry.toLowerCase() === target);
            return found ? path.join(dataDir, found) : null;
          } catch (err) {
            console.warn(`[DATA] Unable to scan data directory for ${dataSheetName}:`, err);
            return null;
          }
        })();
        if (caseInsensitiveMatch) {
          return caseInsensitiveMatch;
        }
        const message = `Test data file '${dataSheetName}' not found in data/. Upload the file before running '${testCaseId}'.`;
        console.warn(`[DATA] ${message}`);
        throw new Error(message);
      }
      return expectedPath;
    };
    const normaliseKey = (value: string) => value.replace(/[^a-z0-9]/gi, '').toLowerCase();
    const findMatchingDataKey = (sourceKey: string) => {
      if (!sourceKey || !dataRow) {
        return undefined;
      }
      const normalisedSource = normaliseKey(sourceKey);
      return Object.keys(dataRow || {}).find((candidate) => normaliseKey(String(candidate)) === normalisedSource);
    };
    const getDataValue = (sourceKey: string, fallback: string) => {
      if (!sourceKey) {
        return fallback;
      }
      const directKey = findMatchingDataKey(sourceKey) || findMatchingDataKey(sourceKey.replace(/([A-Z])/g, '_$1'));
      if (directKey) {
        const candidate = dataRow?.[directKey];
        if (candidate !== undefined && candidate !== null && `${candidate}`.trim() !== '') {
          return `${candidate}`;
        }
      }
      return fallback;
    };
    const dataPath = ensureDataFile();
    if (dataPath && dataReferenceId && dataIdColumn) {
      dataRow = readExcelData(dataPath, dataSheetTab || '', dataReferenceId, dataIdColumn) ?? {};
      if (!dataRow || Object.keys(dataRow).length === 0) {
        console.warn(`[DATA] Row not found in ${dataSheetName} for ${dataIdColumn}='${dataReferenceId}'.`);
      }
    } else if (!dataSheetName) {
      console.log(`[DATA] No DatasheetName configured for ${testCaseId}. Test will run with hardcoded/default values.`);
    } else if (dataSheetName && (!dataReferenceId || !dataIdColumn)) {
      const missingFields = [];
      if (!dataReferenceId) missingFields.push('ReferenceID');
      if (!dataIdColumn) missingFields.push('IDName');
      const message = `DatasheetName='${dataSheetName}' is provided but ${missingFields.join(' and ')} ${missingFields.length > 1 ? 'are' : 'is'} missing. Please provide ${missingFields.join(' and ')} in testmanager.xlsx for '${testCaseId}'.`;
      console.error(`[DATA] ${message}`);
      throw new Error(message);
    }

    await namedStep("Step 0 - Navigate to application and wait for manual authentication", page, testinfo, async () => {
      // Navigate to the original URL
      await page.goto("https://onecognizant.cognizant.com/Welcome");
      // Manual authentication: Complete login steps manually in the browser
      // Wait for first element after authentication
      // await bgestdpage.close.waitFor({ state: "visible", timeout: 60000 });
      const screenshot = await page.screenshot();
      attachScreenshot("Step 0 - Navigate to application and wait for manual authentication", testinfo, screenshot);
    });

    await namedStep("Step 1 - Click the PeopleSoft HCM element", page, testinfo, async () => {
      // Click the PeopleSoft HCM element
      await bgestdpage.peoplesoftHcm.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 1 - Click the PeopleSoft HCM element", testinfo, screenshot);
    });

    await namedStep("Step 2 - Click the element element", page, testinfo, async () => {
      // Click the element element
      await bgestdpage.clickTheElementElement.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 2 - Click the element element", testinfo, screenshot);
    });

    await namedStep("Step 3 - Click the Submit Timesheet element", page, testinfo, async () => {
      // Click the Submit Timesheet element
      await bgestdpage.submitTimesheet.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 3 - Click the Submit Timesheet element", testinfo, screenshot);
    });

    await namedStep("Step 4 - Click the View Assignments element", page, testinfo, async () => {
      // Click the View Assignments element
      await bgestdpage.submitTimesheet.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 4 - Click the View Assignments element", testinfo, screenshot);
    });

    await namedStep("Step 5 - Click the Check Assignment History button", page, testinfo, async () => {
      // Click the Check Assignment History button
      await bgestdpage.checkAssignmentHistory.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 5 - Click the Check Assignment History button", testinfo, screenshot);
    });

    await namedStep("Step 6 - Click the element element", page, testinfo, async () => {
      // Click the element element
      await bgestdpage.clickTheElementElement2.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 6 - Click the element element", testinfo, screenshot);
    });

  });
});

