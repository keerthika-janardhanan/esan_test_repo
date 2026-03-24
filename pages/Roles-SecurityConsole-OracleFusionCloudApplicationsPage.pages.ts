import { Page, Locator } from '@playwright/test';
import HelperClass from '../util/methods.utility.ts';
import locators from '../locators/Roles-SecurityConsole-OracleFusionCloudApplicationsPage';

class RolesSecurityConsoleOracleFusionCloudApplicationsPage {
  page: Page;
  helper: HelperClass;
  usersButton: Locator;
  usernameInput: Locator;
  passwordInput: Locator;
  nextButton: Locator;
  addUserAccountButton: Locator;
  step10Element: Locator;
  demoservicesButton: Locator;
  firstNameInput: Locator;
  lastNameInput: Locator;
  userNameButton: Locator;
  userNameUserNameButton: Locator;
  confirmPasswordInput: Locator;
  addRoleButton: Locator;
  searchInput: Locator;
  searchButton: Locator;
  addRoleMembershipButton: Locator;
  doneButton: Locator;
  saveAndCloseButton: Locator;
  navigatorButton: Locator;
  scheduledProcessesButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new HelperClass(page);
    this.usersButton = page.locator(locators.usersButton).first();
    this.usernameInput = page.locator(locators.usernameInput).first();
    this.passwordInput = page.locator(locators.passwordInput).first();
    this.nextButton = page.locator(locators.nextButton).first();
    this.addUserAccountButton = page.locator(locators.addUserAccountButton).first();
    this.step10Element = page.locator(locators.step10Element).first();
    this.demoservicesButton = page.locator(locators.demoservicesButton).first();
    this.firstNameInput = page.locator(locators.firstNameInput).first();
    this.lastNameInput = page.locator(locators.lastNameInput).first();
    this.userNameButton = page.locator(locators.userNameButton).first();
    this.userNameUserNameButton = page.locator(locators.userNameUserNameButton).first();
    this.confirmPasswordInput = page.locator(locators.confirmPasswordInput).first();
    this.addRoleButton = page.locator(locators.addRoleButton).first();
    this.searchInput = page.locator(locators.searchInput).first();
    this.searchButton = page.locator(locators.searchButton).first();
    this.addRoleMembershipButton = page.locator(locators.addRoleMembershipButton).first();
    this.doneButton = page.locator(locators.doneButton).first();
    this.saveAndCloseButton = page.locator(locators.saveAndCloseButton).first();
    this.navigatorButton = page.locator(locators.navigatorButton).first();
    this.scheduledProcessesButton = page.locator(locators.scheduledProcessesButton).first();
  }

  private coerceValue(value: unknown): string {
    if (value === undefined || value === null) return '';
    if (typeof value === 'number') return `${value}`;
    if (typeof value === 'string') return value;
    return `${value ?? ''}`;
  }

  private normaliseDataKey(value: string): string {
    return (value || '').replace(/[^a-z0-9]+/gi, '').toLowerCase();
  }

  private resolveDataValue(formData: Record<string, any> | null | undefined, key: string, fallback: string = ''): string {
    const target = this.normaliseDataKey(key);
    if (formData) {
      for (const entryKey of Object.keys(formData)) {
        if (this.normaliseDataKey(entryKey) === target) {
          const candidate = this.coerceValue(formData[entryKey]);
          if (candidate.trim() !== '') return candidate;
        }
      }
    }
    return this.coerceValue(fallback);
  }

  async applyData(formData: Record<string, any> | null | undefined, keys?: string[], index: number = 0): Promise<void> {
    const fallbackValues: Record<string, string> = {};
    const targetKeys = Array.isArray(keys) && keys.length ? keys.map((k) => this.normaliseDataKey(k)) : null;
    const shouldHandle = (key: string) => !targetKeys || targetKeys.includes(this.normaliseDataKey(key));
  }
}

export default RolesSecurityConsoleOracleFusionCloudApplicationsPage;