import { test } from './testSetup';
import CloudSignInPage from '../pages/CloudSignInPage.pages';
import WelcomePage from '../pages/WelcomePage.pages';
import RolesSecurityConsoleOracleFusionCloudApplicationsPage from '../pages/Roles-SecurityConsole-OracleFusionCloudApplicationsPage.pages';
import UsersSecurityConsoleOracleFusionCloudApplicationsPage from '../pages/Users-SecurityConsole-OracleFusionCloudApplicationsPage.pages';
import { getTestToRun, shouldRun, readExcelData } from '../util/csvFileManipulation.ts';
import { attachScreenshot, namedStep } from '../util/screenshot.ts';
import * as dotenv from 'dotenv';

const path = require('path');
const fs = require('fs');

dotenv.config();
let executionList: any[];

test.describe('usr create', () => {
  let cloudSignInPage: CloudSignInPage;
  let welcomePage: WelcomePage;
  let rolesSecurityConsolePage: RolesSecurityConsoleOracleFusionCloudApplicationsPage;
  let usersSecurityConsolePage: UsersSecurityConsoleOracleFusionCloudApplicationsPage;

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

  run('usr create', async ({ page }, testinfo) => {
    cloudSignInPage = new CloudSignInPage(page);
    welcomePage = new WelcomePage(page);
    rolesSecurityConsolePage = new RolesSecurityConsoleOracleFusionCloudApplicationsPage(page);
    usersSecurityConsolePage = new UsersSecurityConsoleOracleFusionCloudApplicationsPage(page);

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
      await cloudSignInPage.usernameInput.fill(String(dataRow['UsernameInput']));
      const screenshot = await page.screenshot();
      attachScreenshot('Step 1 - Enter username', testinfo, screenshot);
    });

    await namedStep('Step 2 - Enter password', page, testinfo, async () => {
      await cloudSignInPage.passwordInput.fill(String(dataRow['PasswordInput']));
      const screenshot = await page.screenshot();
      attachScreenshot('Step 2 - Enter password', testinfo, screenshot);
    });

    await namedStep('Step 3 - Click Next', page, testinfo, async () => {
      await cloudSignInPage.nextButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 3 - Click Next', testinfo, screenshot);
    });

    await namedStep('Step 4 - Click Navigator', page, testinfo, async () => {
       await page.waitForTimeout(1000);
      await welcomePage.navigatorButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 4 - Click Navigator', testinfo, screenshot);
    });

    await namedStep('Step 6 - Click Tools', page, testinfo, async () => {
      await welcomePage.toolsButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 6 - Click Tools', testinfo, screenshot);
    });

    await namedStep('Step 7 - Click Security Console', page, testinfo, async () => {
      await welcomePage.securityConsoleButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 7 - Click Security Console', testinfo, screenshot);
    });

    await namedStep('Step 8 - Click Users', page, testinfo, async () => {
      await rolesSecurityConsolePage.usersButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 8 - Click Users', testinfo, screenshot);
    });

    await namedStep('Step 9 - Click Add User Account', page, testinfo, async () => {
      await usersSecurityConsolePage.addUserAccountButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 9 - Click Add User Account', testinfo, screenshot);
    });

    await namedStep('Step 10 - Click element', page, testinfo, async () => {
      await usersSecurityConsolePage.step10Element.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 10 - Click element', testinfo, screenshot);
    });

    await namedStep('Step 11 - Click DEMOSERVICES', page, testinfo, async () => {
      await usersSecurityConsolePage.demoservicesButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 11 - Click DEMOSERVICES', testinfo, screenshot);
    });

    await namedStep('Step 12 - Enter First Name', page, testinfo, async () => {
      await usersSecurityConsolePage.firstNameInput.fill(String(dataRow['FirstNameInput']));
      const screenshot = await page.screenshot();
      attachScreenshot('Step 12 - Enter First Name', testinfo, screenshot);
    });

    await namedStep('Step 13 - Enter Last Name', page, testinfo, async () => {
      await usersSecurityConsolePage.lastNameInput.fill(String(dataRow['LastNameInput']));
      const screenshot = await page.screenshot();
      attachScreenshot('Step 13 - Enter Last Name', testinfo, screenshot);
    });

    await namedStep('Step 14 - Click User Name', page, testinfo, async () => {
      await usersSecurityConsolePage.userNameButton.fill(String(dataRow['UserNameButton']));
      const screenshot = await page.screenshot();
      attachScreenshot('Step 14 - Click User Name', testinfo, screenshot);
    });

    await namedStep('Step 15 - Enter Password', page, testinfo, async () => {
      await usersSecurityConsolePage.passwordInput.fill(String(dataRow['PasswordInput']));
      const screenshot = await page.screenshot();
      attachScreenshot('Step 15 - Enter Password', testinfo, screenshot);
    });

    await namedStep('Step 16 - Enter Confirm Password', page, testinfo, async () => {
      await usersSecurityConsolePage.confirmPasswordInput.fill(String(dataRow['ConfirmPasswordInput']));
      const screenshot = await page.screenshot();
      attachScreenshot('Step 16 - Enter Confirm Password', testinfo, screenshot);
    });

    await namedStep('Step 17 - Click Add Role', page, testinfo, async () => {
      await usersSecurityConsolePage.addRoleButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 17 - Click Add Role', testinfo, screenshot);
    });

    await namedStep('Step 18 - Enter Search', page, testinfo, async () => {
      await usersSecurityConsolePage.searchInput.fill(String(dataRow['SearchInput']));
      const screenshot = await page.screenshot();
      attachScreenshot('Step 18 - Enter Search', testinfo, screenshot);
    });

    await namedStep('Step 19 - Click Search', page, testinfo, async () => {
      await usersSecurityConsolePage.searchButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 19 - Click Search', testinfo, screenshot);
    });

    await namedStep('Step 20 - Click Add Role Membership', page, testinfo, async () => {
      await usersSecurityConsolePage.addRoleMembershipButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 20 - Click Add Role Membership', testinfo, screenshot);
    });

    await namedStep('Step 21 - Click Done', page, testinfo, async () => {
      await usersSecurityConsolePage.doneButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 21 - Click Done', testinfo, screenshot);
    });

    await namedStep('Step 22 - Click Save and Close', page, testinfo, async () => {
      await usersSecurityConsolePage.saveAndCloseButton.click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 22 - Click Save and Close', testinfo, screenshot);
    });
  });
});