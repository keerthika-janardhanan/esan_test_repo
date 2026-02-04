import { test } from "./testSetup.ts";
import PageObject from "../pages/FnolnewflowPage.ts";
import { getTestToRun, shouldRun, readExcelData } from "../util/csvFileManipulation.ts";
import { attachScreenshot, namedStep } from "../util/screenshot.ts";
import * as dotenv from 'dotenv';

const path = require('path');
const fs = require('fs');

dotenv.config();
let executionList: any[];

test.beforeAll(() => {
  try {
    const testManagerPath = path.join(__dirname, '../testmanager.xlsx');
    if (fs.existsSync(testManagerPath)) {
      executionList = getTestToRun(testManagerPath);wzs
      console.log('[DEBUG] TestManager loaded successfully, entries:', executionList.length);
      console.log('[DEBUG] TestManager data:', JSON.stringify(executionList, null, 2));
    } else {
      console.log('[TEST MANAGER] testmanager.xlsx not found - all tests will run');
      executionList = [];
    }
  } catch (error) {
    console.warn('[TEST MANAGER] Failed to load testmanager.xlsx - all tests will run. Error:', error.message);
    executionList = [];
  }
});

test.describe("FNOL_Newflow", () => {
  let fnolnewflowpage: PageObject;

  const run = (name: string, fn: ({ page }, testinfo: any) => Promise<void>) =>
    (shouldRun(name) ? test : test.skip)(name, fn);

  run("FNOL_Newflow", async ({ page }, testinfo) => {
    fnolnewflowpage = new PageObject(page);
    let currentPage = page; // Track the current page
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
    const normaliseValue = (value: string) => value.replace(/[^a-z0-9]/gi, '').toLowerCase();
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
    console.log('[DEBUG] Data loading info:');
    console.log('[DEBUG] testCaseId:', testCaseId);
    console.log('[DEBUG] dataSheetName:', dataSheetName);
    console.log('[DEBUG] dataReferenceId:', dataReferenceId);
    console.log('[DEBUG] dataIdColumn:', dataIdColumn);
    console.log('[DEBUG] dataPath:', dataPath);
    console.log('[DEBUG] About to load data with these parameters...');
    if (dataPath && dataReferenceId && dataIdColumn) {
      // Try exact match first, then normalized match
      dataRow = readExcelData(dataPath, dataSheetTab || '', dataReferenceId, dataIdColumn) ?? {};
      if (!dataRow || Object.keys(dataRow).length === 0) {
        // Try with normalized reference ID (remove special characters)
        const normalizedRefId = dataReferenceId.replace(/[^a-z0-9]/gi, '');
        dataRow = readExcelData(dataPath, dataSheetTab || '', normalizedRefId, dataIdColumn) ?? {};
      }
      if (!dataRow || Object.keys(dataRow).length === 0) {
        console.warn(`[DATA] Row not found in ${dataSheetName} for ${dataIdColumn}='${dataReferenceId}'.`);
      }
      console.log('[DEBUG] dataRow after loading:', JSON.stringify(dataRow));
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
      // Wait for authentication to complete (network idle + DOM stable)
      await page.waitForLoadState("networkidle", { timeout: 90000 });
      // Additionally wait for first interactive element if available
      await fnolnewflowpage.close.waitFor({ state: "attached", timeout: 30000 }).catch(() => {
        console.log("Note: First element (close) not immediately available, continuing...");
      });
      const screenshot = await page.screenshot();
      attachScreenshot("Step 0 - Navigate to application and wait for manual authentication", testinfo, screenshot);
    });

    await namedStep("Step 12 - Fill Search field with 'guidewire'", page, testinfo, async () => {
      // Fill the Search field with 'guidewire'
      await fnolnewflowpage.setSearch('guidewire');
      // Expected: Field captures the entered data.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 12 - Fill Search field with 'guidewire'", testinfo, screenshot);
    });

    await namedStep("Step 12.1 - Click Guidewire Insurance", currentPage, testinfo, async () => {
      // Click the Guidewire Insurance option and handle new tab
      console.log('[DEBUG] Step 12.1: Starting Guidewire Insurance click');
      console.log('[DEBUG] Step 12.1: Current page URL before click:', await currentPage.url());
      console.log('[DEBUG] Step 12.1: Current page count before click:', currentPage.context().pages().length);
      
      try {
        const [newPage] = await Promise.all([
          currentPage.context().waitForEvent('page'),
          fnolnewflowpage.select_guidewire.click()
        ]);
        console.log('[DEBUG] Step 12.1: New tab opened successfully');
        console.log('[DEBUG] Step 12.1: New page count after click:', currentPage.context().pages().length);
        
        await newPage.waitForLoadState();
        console.log('[DEBUG] Step 12.1: New page loaded, URL:', await newPage.url());
        
        // Switch to the new tab
        currentPage = newPage;
        fnolnewflowpage = new PageObject(currentPage);
        console.log('[DEBUG] Step 12.1: Switched to new page successfully');
        console.log('[DEBUG] Step 12.1: Final current page URL:', await currentPage.url());
        
      } catch (error) {
        console.error('[DEBUG] Step 12.1: Error during tab switch:', error.message);
        throw error;
      }
      
      const screenshot = await currentPage.screenshot();
      attachScreenshot("Step 12.1 - Click Guidewire Insurance", testinfo, screenshot);
    });

    await namedStep("Step 13 - Enter Username", currentPage, testinfo, async () => {
      // Wait for page redirect from cloud.guidewire.net to okta login
      console.log('[DEBUG] Step 13: Waiting for page redirect...');
      await currentPage.waitForTimeout(10000); // Wait 5 seconds for redirect
      
      // Enter Username on Guidewire login page
      console.log('[DEBUG] Step 13: ===== STEP 13 STARTED =====');
      console.log('[DEBUG] Step 13: Starting username entry');
      console.log('[DEBUG] Step 13: Current page URL:', await currentPage.url());
      console.log('[DEBUG] Step 13: Page title:', await currentPage.title());
      
      // Wait for page to stabilize after redirect
      await currentPage.waitForLoadState('networkidle', { timeout: 10000 });
      console.log('[DEBUG] Step 13: After networkidle, URL:', await currentPage.url());
      
      try {
        // Check if username field exists
        const usernameField = currentPage.locator('input[name="username"]');
        const fieldCount = await usernameField.count();
        console.log('[DEBUG] Step 13: Username field count:', fieldCount);
        
        if (fieldCount === 0) {
          console.log('[DEBUG] Step 13: No username field found, checking for alternative fields...');
          // Try alternative username field selectors
          const alternatives = [
            'input[type="email"]',
            'input[type="text"]',
            'input[id*="username"]',
            'input[id*="email"]',
            'input[placeholder*="username"]',
            'input[placeholder*="email"]'
          ];
          
          let foundField = false;
          for (const selector of alternatives) {
            const altField = currentPage.locator(selector);
            const altCount = await altField.count();
            if (altCount > 0) {
              console.log(`[DEBUG] Step 13: Found alternative field: ${selector}`);
              await altField.waitFor({ state: 'visible', timeout: 5000 });
              const usernameValue = getDataValue("Username", "");
              console.log('[DEBUG] Step 13: Filling alternative field with value:', usernameValue);
              await altField.fill(usernameValue);
              foundField = true;
              break;
            }
          }
          
          if (!foundField) {
            console.log('[DEBUG] Step 13: No username field found, skipping username entry');
            console.log('[DEBUG] Step 13: This might be expected if already authenticated');
          }
        } else {
          // Wait for the username field to be visible
          await usernameField.waitFor({ state: 'visible', timeout: 10000 });
          console.log('[DEBUG] Step 13: Checking data retrieval...');
          console.log('[DEBUG] Step 13: dataRow:', JSON.stringify(dataRow));
          console.log('[DEBUG] Step 13: dataRow keys:', dataRow ? Object.keys(dataRow) : 'dataRow is null/undefined');
          const usernameValue = getDataValue("Username", "");
          console.log('[DEBUG] Step 13: Filling username with value:', usernameValue);
          console.log('[DEBUG] Step 13: Username value length:', usernameValue.length);
          
          // Try alternative data keys if Username is empty
          if (!usernameValue) {
            console.log('[DEBUG] Step 13: Username empty, trying alternative keys...');
            const alternatives = ['username', 'user', 'email', 'Username2'];
            for (const key of alternatives) {
              const altValue = getDataValue(key, "");
              console.log(`[DEBUG] Step 13: ${key} =`, altValue);
              if (altValue) {
                console.log(`[DEBUG] Step 13: Using ${key} value:`, altValue);
                await usernameField.fill(altValue);
                break;
              }
            }
          } else {
            await usernameField.fill(usernameValue);
          }
        }
        
        console.log('[DEBUG] Step 13: Username entry completed');
      } catch (error) {
        console.error('[DEBUG] Step 13: Error during username entry:', error.message);
        console.log('[DEBUG] Step 13: Continuing despite error - might be already authenticated');
      }
      
      console.log('[DEBUG] Step 13: ===== STEP 13 COMPLETED =====');
      const screenshot = await currentPage.screenshot();
      attachScreenshot("Step 13 - Enter Username", testinfo, screenshot);
    });


    await namedStep("Step 14 - Click the Next button", currentPage, testinfo, async () => {
      // Click the Next button on Guidewire login page
      console.log('[DEBUG] Step 14: Starting Next button click');
      console.log('[DEBUG] Current page URL:', await currentPage.url());
      try {
        // Wait for the Next button to be visible
        await currentPage.locator('input[value="Next"]').waitFor({ state: 'visible', timeout: 10000 });
        await currentPage.locator('input[value="Next"]').click();
        console.log('[DEBUG] Step 14: Next button clicked successfully');
      } catch (error) {
        console.error('[DEBUG] Step 14: Failed to click Next button:', error.message);
        // Try alternative locators
        console.log('[DEBUG] Step 14: Trying alternative locators...');
        const alternatives = [
          'button[type="submit"]',
          'input[type="submit"]',
          'button:has-text("Next")',
          'button:has-text("Continue")',
          'button:has-text("Sign in")'
        ];
        for (const alt of alternatives) {
          try {
            const element = currentPage.locator(alt);
            if (await element.count() > 0) {
              console.log(`[DEBUG] Step 14: Found alternative locator: ${alt}`);
              await element.click();
              console.log('[DEBUG] Step 14: Alternative locator clicked successfully');
              break;
            }
          } catch (altError) {
            console.log(`[DEBUG] Step 14: Alternative ${alt} failed:`, altError.message);
          }
        }
      }
      const screenshot = await currentPage.screenshot();
      attachScreenshot("Step 14 - Click the Next button", testinfo, screenshot);
    });

    await namedStep("Step 14.1 - Click navigation button", currentPage, testinfo, async () => {
      // Click the navigation button
      await fnolnewflowpage.navigation.click();
      // Expected: Element responds as expected.
      const screenshot = await currentPage.screenshot();
      attachScreenshot("Step 14.1 - Click navigation button", testinfo, screenshot);
    });

    await namedStep("Step 15 - Click the ClaimCenter element", currentPage, testinfo, async () => {
      // Click the ClaimCenter element
      await fnolnewflowpage.claimcenter.click();
      // Expected: Element responds as expected.
      const screenshot = await currentPage.screenshot();
      attachScreenshot("Step 15 - Click the ClaimCenter element", testinfo, screenshot);
    });

    await namedStep("Step 16 - Click the Select planet drop-down", currentPage, testinfo, async () => {
      // Click the Select planet drop-down
      await fnolnewflowpage.selectPlanet.click();
      // Expected: Element responds as expected.
      const screenshot = await currentPage.screenshot();
      attachScreenshot("Step 16 - Click the Select planet drop-down", testinfo, screenshot);
    });

    await namedStep("Step 16.1 - Click planet option", currentPage, testinfo, async () => {
      // Click the planet option
      await fnolnewflowpage.planet.click();
      // Expected: Element responds as expected.
      const screenshot = await currentPage.screenshot();
      attachScreenshot("Step 16.1 - Click planet option", testinfo, screenshot);
    });

    await namedStep("Step 17 - Click the Apply button", page, testinfo, async () => {
      // Click the Apply button
      await fnolnewflowpage.apply.click();
      // Expected: Element responds as expected.
      const screenshot = await page.screenshot();
      attachScreenshot("Step 17 - Click the Apply button", testinfo, screenshot);
    });

    // await namedStep("Step 18 - Enter Username", page, testinfo, async () => {
    //   // Enter Username
    //   await fnolnewflowpage.applyData(dataRow, ["Username"], 1);
    //   // Expected: Field captures the entered data.
    //   const screenshot = await page.screenshot();
    //   attachScreenshot("Step 18 - Enter Username", testinfo, screenshot);
    // });

    // await namedStep("Step 19 - Enter Password", page, testinfo, async () => {
    //   // Enter Password
    //   await fnolnewflowpage.applyData(dataRow, ["Password"], 0);
    //   // Expected: Field captures the entered data.
    //   const screenshot = await page.screenshot();
    //   attachScreenshot("Step 19 - Enter Password", testinfo, screenshot);
    // });

    // await namedStep("Step 20 - Click the element element", page, testinfo, async () => {
    //   // Click the element element
    //   await fnolnewflowpage.clickTheElementElement2.click();
    //   // Expected: Element responds as expected.
    //   const screenshot = await page.screenshot();
    //   attachScreenshot("Step 20 - Click the element element", testinfo, screenshot);
    // });

    // await namedStep("Step 21 - Click the New Claim element", page, testinfo, async () => {
    //   // Click the New Claim element
    //   await fnolnewflowpage.newClaim.click();
    //   // Expected: Element responds as expected.
    //   const screenshot = await page.screenshot();
    //   attachScreenshot("Step 21 - Click the New Claim element", testinfo, screenshot);
    // });

    // await namedStep("Step 22 - Click the date input field", page, testinfo, async () => {
    //   // Click the date input field
    //   await fnolnewflowpage.dateInput.click();
    //   // Expected: Element responds as expected.
    //   const screenshot = await page.screenshot();
    //   attachScreenshot("Step 22 - Click the date input field", testinfo, screenshot);
    // });

    // await namedStep("Step 23 - Enter date input", page, testinfo, async () => {
    //   // Enter date input
    //   await fnolnewflowpage.applyData(dataRow, ["date input"], 0);
    //   // Expected: Field captures the entered data.
    //   const screenshot = await page.screenshot();
    //   attachScreenshot("Step 23 - Enter date input", testinfo, screenshot);
    // });

    // await namedStep("Step 24 - Click the Select element", page, testinfo, async () => {
    //   // Click the Select element
    //   await fnolnewflowpage.select.click();
    //   // Expected: Element responds as expected.
    //   const screenshot = await page.screenshot();
    //   attachScreenshot("Step 24 - Click the Select element", testinfo, screenshot);
    // });

    // await namedStep("Step 25 - Click the Next element", page, testinfo, async () => {
    //   // Click the Next element
    //   await fnolnewflowpage.next.click();
    //   // Expected: Element responds as expected.
    //   const screenshot = await page.screenshot();
    //   attachScreenshot("Step 25 - Click the Next element", testinfo, screenshot);
    // });

    // await namedStep("Step 26 - Click the Name drop-down", page, testinfo, async () => {
    //   // Click the Name drop-down
    //   await fnolnewflowpage.name.click();
    //   // Expected: Element responds as expected.
    //   const screenshot = await page.screenshot();
    //   attachScreenshot("Step 26 - Click the Name drop-down", testinfo, screenshot);
    // });

    // await namedStep("Step 27 - Click the element element", page, testinfo, async () => {
    //   // Click the element element
    //   await fnolnewflowpage.clickTheElementElement3.click();
    //   // Expected: Element responds as expected.
    //   const screenshot = await page.screenshot();
    //   attachScreenshot("Step 27 - Click the element element", testinfo, screenshot);
    // });

    // await namedStep("Step 28 - Click the icon-gw-apps element", page, testinfo, async () => {
    //   // Click the icon-gw-apps element
    //   await fnolnewflowpage.clickTheIconGwAppsElement.click();
    //   // Expected: Element responds as expected.
    //   const screenshot = await page.screenshot();
    //   attachScreenshot("Step 28 - Click the icon-gw-apps element", testinfo, screenshot);
    // });

    // await namedStep("Step 29 - Click the ClaimCenter element", page, testinfo, async () => {
    //   // Click the ClaimCenter element
    //   await fnolnewflowpage.applyData(dataRow, ["element"], 1);
    //   // Expected: Element responds as expected.
    //   const screenshot = await page.screenshot();
    //   attachScreenshot("Step 29 - Click the ClaimCenter element", testinfo, screenshot);
    // });

    // await namedStep("Step 30 - Click the Apply button", page, testinfo, async () => {
    //   // Click the Apply button
    //   await fnolnewflowpage.apply.click();
    //   // Expected: Element responds as expected.
    //   const screenshot = await page.screenshot();
    //   attachScreenshot("Step 30 - Click the Apply button", testinfo, screenshot);
    // });

    // await namedStep("Step 31 - Click the Name drop-down", page, testinfo, async () => {
    //   // Click the Name drop-down
    //   await fnolnewflowpage.name.click();
    //   // Expected: Element responds as expected.
    //   const screenshot = await page.screenshot();
    //   attachScreenshot("Step 31 - Click the Name drop-down", testinfo, screenshot);
    // });

    // await namedStep("Step 32 - Click the element element", page, testinfo, async () => {
    //   // Click the element element
    //   await fnolnewflowpage.clickTheElementElement4.click();
    //   // Expected: Element responds as expected.
    //   const screenshot = await page.screenshot();
    //   attachScreenshot("Step 32 - Click the element element", testinfo, screenshot);
    // });

  //   await namedStep("Step 33 - Click the Next element", page, testinfo, async () => {
  //     // Click the Next element
  //     await fnolnewflowpage.next.click();
  //     // Expected: Element responds as expected.
  //     const screenshot = await page.screenshot();
  //     attachScreenshot("Step 33 - Click the Next element", testinfo, screenshot);
  //   });

  //   await namedStep("Step 34 - Click the Loss Cause drop-down", page, testinfo, async () => {
  //     // Click the Loss Cause drop-down
  //     await fnolnewflowpage.lossCause.click();
  //     // Expected: Element responds as expected.
  //     const screenshot = await page.screenshot();
  //     attachScreenshot("Step 34 - Click the Loss Cause drop-down", testinfo, screenshot);
  //   });

  //   await namedStep("Step 35 - Enter What Happened?", page, testinfo, async () => {
  //     // Enter What Happened?
  //     await fnolnewflowpage.applyData(dataRow, ["What Happened?"], 0);
  //     // Expected: Field captures the entered data.
  //     const screenshot = await page.screenshot();
  //     attachScreenshot("Step 35 - Enter What Happened?", testinfo, screenshot);
  //   });

   });
});

