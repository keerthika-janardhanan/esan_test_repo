import { test } from "./testSetup.ts";
import PageObject from "../pages/CreateinvoicepayablesPage.ts";
import LoginPage from "../pages/login.page.ts";
import HomePage from "../pages/home.page.ts";
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

test.describe("Create_invoice_payables", () => {
  let createinvoicepayablespage: PageObject;
  let loginPage: LoginPage;
  let homePage: HomePage;

  const run = (name: string, fn: ({ page }, testinfo: any) => Promise<void>) =>
    (shouldRun(name) ? test : test.skip)(name, fn);

  run("Create_invoice_payables", async ({ page }, testinfo) => {
    createinvoicepayablespage = new PageObject(page);
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    const testCaseId = testinfo.title;
    const testRow: Record<string, any> = executionList?.find((row: any) => row['TestCaseID'] === testCaseId) ?? {};
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
    console.log(`[ReferenceID] Using: ${dataReferenceId} (source: ${envReferenceId ? 'env' : 'excel'})`);
    const dataIdColumn = String(testRow?.['IDName'] ?? '').trim() || defaultIdColumn;
    const dataSheetTab = String(testRow?.['SheetName'] ?? testRow?.['Sheet'] ?? '').trim();
    const dataDir = path.join(__dirname, '../data');
    fs.mkdirSync(dataDir, { recursive: true });
    let dataRow: Record<string, any> = {};
    const ensureDataFile = (): string | null => {
      if (!dataSheetName) {
        console.warn(`[DATA] DatasheetName missing for ${testCaseId}; using generated defaults.`);
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
    } else if (dataSheetName) {
      console.warn(`[DATA] DatasheetName provided but ReferenceID/IDName missing for ${testCaseId}. Generated defaults will be used.`);
    }

    await namedStep("Step 0 - Click the User Name field", page, testinfo, async () => {
      // Click the User Name field
      await loginPage.goto();
      await loginPage.login(process.env.USERID ?? '', process.env.PASSWORD ?? '');
      const screenshot = await page.screenshot();
      attachScreenshot("Step 0 - Click the User Name field", testinfo, screenshot);
      // Expected: Element responds as expected.
    });

    await namedStep("Step 8 - Click the element element", page, testinfo, async () => {
      // Click the element element
      await createinvoicepayablespage.clickTheElementElement.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 8 - Click the element element", testinfo, screenshot);
    });

    await namedStep("Step 9 - Click the Payables element", page, testinfo, async () => {
      // Click the Payables element
      await createinvoicepayablespage.payables.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 9 - Click the Payables element", testinfo, screenshot);
    });

    await namedStep("Step 10 - Click the Invoices element", page, testinfo, async () => {
      // Click the Invoices element
      await createinvoicepayablespage.invoices.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 10 - Click the Invoices element", testinfo, screenshot);
    });

    await namedStep("Step 11 - Click the Create Invoice button", page, testinfo, async () => {
      // Click the Create Invoice button
      await createinvoicepayablespage.createInvoice.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 11 - Click the Create Invoice button", testinfo, screenshot);
    });

    await namedStep("Step 12 - Click the element element", page, testinfo, async () => {
      // Click the element element
      await createinvoicepayablespage.searchBusinessUnit.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 12 - Click the element element", testinfo, screenshot);
    });

    await namedStep("Step 13 - Click the FU01 US BU01 element", page, testinfo, async () => {
      // Click the FU01 US BU01 element
      await createinvoicepayablespage.fu01UsBu01.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 13 - Click the FU01 US BU01 element", testinfo, screenshot);
    });

    await namedStep("Step 14 - Enter Supplier", page, testinfo, async () => {
      // Enter Supplier
      await createinvoicepayablespage.applyData(dataRow, ["Supplier"], 0);
      // Expected: Field captures the entered data.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 14 - Enter Supplier", testinfo, screenshot);
    });

    await namedStep("Step 15 - Click the Number field", page, testinfo, async () => {
      // Click the Number field
      await createinvoicepayablespage.number.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 15 - Click the Number field", testinfo, screenshot);
    });

    await namedStep("Step 16 - Enter Number", page, testinfo, async () => {
      // Enter Number
      await createinvoicepayablespage.applyData(dataRow, ["Number"], 0);
      // Expected: Field captures the entered data.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 16 - Enter Number", testinfo, screenshot);
    });

    await namedStep("Step 17 - Click the Amount field", page, testinfo, async () => {
      // Click the Amount field
      await createinvoicepayablespage.amount.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 17 - Click the Amount field", testinfo, screenshot);
    });

    await namedStep("Step 18 - Enter Amount", page, testinfo, async () => {
      // Enter Amount
      await createinvoicepayablespage.applyData(dataRow, ["Amount"], 0);
      // Expected: Field captures the entered data.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 18 - Enter Amount", testinfo, screenshot);
    });

    await namedStep("Step 19 - Click the Expand Lines button", page, testinfo, async () => {
      // Click the Expand Lines button
      await createinvoicepayablespage.expandLines.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 19 - Click the Expand Lines button", testinfo, screenshot);
    });

    await namedStep("Step 20 - Click the Amount field", page, testinfo, async () => {
      // Click the Amount field
      await createinvoicepayablespage.amount2.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 20 - Click the Amount field", testinfo, screenshot);
    });

    await namedStep("Step 21 - Enter Amount", page, testinfo, async () => {
      // Enter Amount
      await createinvoicepayablespage.applyData(dataRow, ["Amount"], 1);
      // Expected: Field captures the entered data.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 21 - Enter Amount", testinfo, screenshot);
    });

    await namedStep("Step 22 - Click the element element", page, testinfo, async () => {
      // Click the element element
      await createinvoicepayablespage.searchDistributionSet.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 22 - Click the element element", testinfo, screenshot);
    });

    await namedStep("Step 23 - Click the Office Supplies cell", page, testinfo, async () => {
      // Click the Office Supplies cell
      await createinvoicepayablespage.officeSupplies.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 23 - Click the Office Supplies cell", testinfo, screenshot);
    });

    await namedStep("Step 24 - Click the element element", page, testinfo, async () => {
      // Click the element element
      await createinvoicepayablespage.searchPaymentTerms.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 24 - Click the element element", testinfo, screenshot);
    });

    await namedStep("Step 25 - Click the Immediate cell", page, testinfo, async () => {
      // Click the Immediate cell
      await createinvoicepayablespage.immediate.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 25 - Click the Immediate cell", testinfo, screenshot);
    });

    await namedStep("Step 26 - Click the Invoice Actions link", page, testinfo, async () => {
      // Click the Invoice Actions link
      await createinvoicepayablespage.invoiceActions.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 26 - Click the Invoice Actions link", testinfo, screenshot);
    });

    await namedStep("Step 27 - Click the Validate cell", page, testinfo, async () => {
      // Click the Validate cell
      await createinvoicepayablespage.validate.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 27 - Click the Validate cell", testinfo, screenshot);
    });

    await namedStep("Step 28 - Click the Save and Close element", page, testinfo, async () => {
      // Click the Save and Close element
      await createinvoicepayablespage.saveAndClose.click();
      // Expected: Confirmation dialog is displayed.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 28 - Click the Save and Close element", testinfo, screenshot);
    });

  });
});
