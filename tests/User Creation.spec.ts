import { test ,expect} from './testSetup';
import CloudSignInPage from '../pages/CloudSignInPage.pages';
import WelcomePage from '../pages/WelcomePage.pages';
import RolesSecurityConsoleOracleFusionCloudApplicationsPage from '../pages/Roles-SecurityConsole-OracleFusionCloudApplicationsPage.pages';
import UsersSecurityConsoleOracleFusionCloudApplicationsPage from '../pages/Users-SecurityConsole-OracleFusionCloudApplicationsPage.pages';
import MonitorProcessesScheduledProcessesOracleFusionCloudApplicationsPage from '../pages/MonitorProcesses-ScheduledProcesses-OracleFusionCloudApplicationsPage.pages';
import { getTestToRun, shouldRun, readExcelData } from '../util/csvFileManipulation.ts';
import { attachScreenshot, namedStep } from '../util/screenshot.ts';
import * as dotenv from 'dotenv';

const path = require('path');
const fs = require('fs');

dotenv.config();
let executionList: any[];

test.describe('User Creation', () => {
  let cloudSignInPage: CloudSignInPage;
  let welcomePage: WelcomePage;
  let rolesSecurityConsolePage: RolesSecurityConsoleOracleFusionCloudApplicationsPage;
  let usersSecurityConsolePage: UsersSecurityConsoleOracleFusionCloudApplicationsPage;
  let monitorProcessesPage: MonitorProcessesScheduledProcessesOracleFusionCloudApplicationsPage;

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

  run('User Creation', async ({ page }, testinfo) => {
    cloudSignInPage = new CloudSignInPage(page);
    welcomePage = new WelcomePage(page);
    rolesSecurityConsolePage = new RolesSecurityConsoleOracleFusionCloudApplicationsPage(page);
    usersSecurityConsolePage = new UsersSecurityConsoleOracleFusionCloudApplicationsPage(page);
    monitorProcessesPage = new MonitorProcessesScheduledProcessesOracleFusionCloudApplicationsPage(page);

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
      await page.getByRole('textbox', { name: 'Username' }).click();
      await page.getByRole('textbox', { name: 'Username' }).fill('FIN_IMPL');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 1 - Enter username', testinfo, screenshot);
    });

    await namedStep('Step 2 - Enter password', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'Password' }).click();
      await page.getByRole('textbox', { name: 'Password' }).fill('sy4r#2V%');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 2 - Enter password', testinfo, screenshot);
    });

    await namedStep('Step 3 - Click Next', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Next' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 3 - Click Next', testinfo, screenshot);
    });

    await namedStep('Step 4 - Click Navigator', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Navigator' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 4 - Click Navigator', testinfo, screenshot);
    });

    await namedStep('Step 5 - Click Tools', page, testinfo, async () => {
      await page.getByTitle('Tools', { exact: true }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 5 - Click Tools', testinfo, screenshot);
    });

    await namedStep('Step 6 - Click Security Console', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Security Console' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 6 - Click Security Console', testinfo, screenshot);
    });

    await namedStep('Step 7 - Click Users', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Users' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 7 - Click Users', testinfo, screenshot);
    });

    await namedStep('Step 8 - Click Add User Account', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Add User Account' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 8 - Click Add User Account', testinfo, screenshot);
    });

    await namedStep('Step 9 - Click category dropdown', page, testinfo, async () => {
      await page.locator('[id="_FOpt1:_FOr1:0:_FONSr2:0:_FOTr1:2:sp1:addCategorySoc::drop"]').click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 9 - Click category dropdown', testinfo, screenshot);
    });

    await namedStep('Step 10 - Select DEMOSERVICES', page, testinfo, async () => {
      await page.getByRole('option', { name: 'DEMOSERVICES' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 10 - Select DEMOSERVICES', testinfo, screenshot);
    });

    await namedStep('Step 11 - Enter First Name', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'First Name' }).click();
      await page.getByRole('textbox', { name: 'First Name' }).fill('HIX');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 11 - Enter First Name', testinfo, screenshot);
    });

    await namedStep('Step 12 - Enter Last Name', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'Last Name' }).click();
      await page.getByRole('textbox', { name: 'Last Name' }).fill('DEMO');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 12 - Enter Last Name', testinfo, screenshot);
    });

    let userName = '';
    await namedStep('Step 13 - Click User Name field and auto-capture', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'User Name' }).click();
      await page.waitForTimeout(2000);
      await expect(page.getByRole('textbox', { name: 'User Name' })).not.toHaveValue('');
      userName = await page.getByRole('textbox', { name: 'User Name' }).inputValue();
      console.log('Auto-filled username:', userName);
      const screenshot = await page.screenshot();
      attachScreenshot('Step 13 - Click User Name field and auto-capture', testinfo, screenshot);
    });

    await namedStep('Step 14 - Enter Password', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'Password', exact: true }).click();
      await page.getByRole('textbox', { name: 'Password', exact: true }).fill('test1234');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 14 - Enter Password', testinfo, screenshot);
    });

    await namedStep('Step 15 - Enter Confirm Password', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'Confirm Password' }).click();
      await page.getByRole('textbox', { name: 'Confirm Password' }).fill('test1234');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 15 - Enter Confirm Password', testinfo, screenshot);
    });

    await namedStep('Step 16 - Click Add Role', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Add Role' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 16 - Click Add Role', testinfo, screenshot);
    });

    await namedStep('Step 17 - Enter Search for role', page, testinfo, async () => {
      await page.getByPlaceholder('Enter 3 or more characters to').click();
      await page.getByPlaceholder('Enter 3 or more characters to').pressSequentially('Accounts Payable Manager UK Business UNIT', { delay: 50 });
      const screenshot = await page.screenshot();
      attachScreenshot('Step 17 - Enter Search for role', testinfo, screenshot);
    });

    await namedStep('Step 18 - Click Search', page, testinfo, async () => {
      await page.locator('[id="__af_Z_window"]').getByRole('link', { name: 'Search' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 18 - Click Search', testinfo, screenshot);
    });

    await namedStep('Step 19 - Select AP role', page, testinfo, async () => {
      await page.getByText('AP_ACCOUNTS_PAYABLE_MANAGER_JOB_UK Business Unit').click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 19 - Select AP role', testinfo, screenshot);
    });

    await namedStep('Step 20 - Click Add Role Membership', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Add Role Membership' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 20 - Click Add Role Membership', testinfo, screenshot);
    });

    await namedStep('Step 21 - Click Done', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Done' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 21 - Click Done', testinfo, screenshot);
    });

    await namedStep('Step 22 - Click Save and Close', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Save and Close' }).click();
      await page.waitForTimeout(1000);
      await expect(page.locator('[id="_FOpt1:_UISpageCust"]')).toContainText('Add User Account');
      const screenshot = await page.screenshot();
      attachScreenshot('Step 22 - Click Save and Close', testinfo, screenshot);
    });

    await namedStep('Step 23 - Click Navigator for Scheduled Processes', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Navigator' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 23 - Click Navigator for Scheduled Processes', testinfo, screenshot);
    });

    await namedStep('Step 24 - Click Scheduled Processes', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Scheduled Processes' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 24 - Click Scheduled Processes', testinfo, screenshot);
    });

    await namedStep('Step 25 - Click Schedule New Process', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Schedule New Process' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 25 - Click Schedule New Process', testinfo, screenshot);
    });

    await namedStep('Step 26 - Select process name', page, testinfo, async () => {
      await page.getByRole('combobox', { name: 'Name' }).click();
      await page.getByTitle('Search: Name').click();
      await page.getByRole('link', { name: 'Search...' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 26 - Select process name', testinfo, screenshot);
    });

    await namedStep('Step 27 - Search and select LDAP process', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'Name' }).click();
      await page.getByRole('textbox', { name: 'Name' }).fill('Retrieve Latest LDAP Changes');
      await page.getByRole('button', { name: 'Search', exact: true }).click();
      await page.getByRole('cell', { name: 'Retrieve Latest LDAP Changes', exact: true }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 27 - Search and select LDAP process', testinfo, screenshot);
    });

    await namedStep('Step 28 - Click OK on process details', page, testinfo, async () => {
      await page.getByRole('button', { name: 'OK' }).nth(1).click();
      await page.waitForTimeout(1000);
      await page.getByRole('button', { name: 'OK' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 28 - Click OK on process details', testinfo, screenshot);
    });

    let processNumber = 9220393;
    await namedStep('Step 29 - Submit process', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Submit', exact: true }).click();
      try {
        await expect(page.locator('[id="__af_Z_window"]')).toContainText(/Process \d+ was submitted/, { timeout: 4000 });
        const text = await page.locator('[id="__af_Z_window"]').textContent();
        const matched = text?.match(/Process (\d+) was submitted/)?.[1];
        processNumber = matched ? parseInt(matched, 10) : processNumber;
        console.log('Process number:', processNumber);
        await page.getByRole('button', { name: 'OK' }).click();
      } catch (error) {
        await page.getByRole('button', { name: 'OK' }).click();
        await page.waitForTimeout(1000);
        await page.locator('xpath=//*[@id="_FOpt1:_FOr1:0:_FONSr2:0:_FOTsr1:0:pt1:srspw1::close"]').click();
      }
      const screenshot = await page.screenshot();
      attachScreenshot('Step 29 - Submit process', testinfo, screenshot);
    });

    await namedStep('Step 30 - Search for process by ID', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Expand Search' }).click();
      await page.getByRole('textbox', { name: 'Process ID' }).click();
      await page.getByRole('textbox', { name: 'Process ID' }).fill(processNumber?.toString() ?? '');
      await page.getByRole('button', { name: 'Search', exact: true }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 30 - Search for process by ID', testinfo, screenshot);
    });

    await namedStep('Step 31 - Refresh and sign out', page, testinfo, async () => {
      await page.getByRole('button', { name: 'Refresh' }).click();
      await page.getByRole('link', { name: 'Settings and Actions' }).click();
      await page.getByRole('link', { name: 'Sign Out' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 31 - Refresh and sign out', testinfo, screenshot);
    });

    await namedStep('Step 32 - Sign in with new user', page, testinfo, async () => {
      await page.getByRole('textbox', { name: 'Username' }).fill(userName);
      await page.getByRole('textbox', { name: 'Password' }).click();
      await page.getByRole('textbox', { name: 'Password' }).fill('test1234');
      await page.getByRole('button', { name: 'Next' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 32 - Sign in with new user', testinfo, screenshot);
    });

    await namedStep('Step 33 - Navigate to Invoices', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Navigator' }).click();
      await page.getByTitle('Payables', { exact: true }).click();
      await page.getByRole('link', { name: 'Invoices' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 33 - Navigate to Invoices', testinfo, screenshot);
    });

    await namedStep('Step 34 - View Tasks', page, testinfo, async () => {
      await page.getByRole('link', { name: 'Tasks' }).click();
      const screenshot = await page.screenshot();
      attachScreenshot('Step 34 - View Tasks', testinfo, screenshot);
    });
  });
});