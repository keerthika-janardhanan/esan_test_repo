import { Page, Locator } from '@playwright/test';
import HelperClass from "../util/methods.utility.ts";
import locators from "../locators/fnol-newflow.ts";

class Fnolnewflowpage {
  page: Page;
  helper: HelperClass;
  close: Locator;
  close2: Locator;
  search: Locator;
  select_guidewire: Locator;
  username: Locator;
  guidewire_username: Locator;
  guidewire_next: Locator;
  navigation: Locator;
  clickTheElementElement: Locator;
  claimcenter: Locator;
  selectPlanet: Locator;
  planet: Locator;
  apply: Locator;
  username2: Locator;
  password: Locator;
  clickTheElementElement2: Locator;
  claim: Locator;
  newClaim: Locator;
  dateInput: Locator;
  claimSearch: Locator;
  select: Locator;
  next: Locator;
  name: Locator;
  person_name: Locator;
  selectVehicle: Locator;
  newStep: Locator;
  lossCause: Locator;
  vehicleCollision: Locator;
  whatHappened: Locator;
  finish: Locator;
  claim00000007546HasBeenSuccessfullySaved: Locator;

  constructor(page: Page) {
    this.page = page;
    this.helper = new HelperClass(page);
    this.close = page.locator(locators.close);
    this.close2 = page.locator(locators.close2);
    this.search = page.locator(locators.search);
    this.select_guidewire = page.locator(locators.select_guidewire);
    this.username = page.locator(locators.username);
    this.guidewire_username = page.locator(locators.guidewire_username);
    this.guidewire_next = page.locator(locators.guidewire_next);
    this.navigation = page.locator(locators.navigation);
    this.clickTheElementElement = page.locator(locators.clickTheElementElement);
    this.claimcenter = page.locator(locators.claimcenter);
    this.selectPlanet = page.locator(locators.selectPlanet);
    this.planet = page.locator(locators.planet);
    this.apply = page.locator(locators.apply);
    this.username2 = page.locator(locators.username2);
    this.password = page.locator(locators.password);
    this.clickTheElementElement2 = page.locator(locators.clickTheElementElement2);
    this.claim = page.locator(locators.claim);
    this.newClaim = page.locator(locators.newClaim);
    this.dateInput = page.locator(locators.dateInput);
    this.claimSearch = page.locator(locators.claimSearch);
    this.select = page.locator(locators.select);
    this.next = page.locator(locators.next);
    this.name = page.locator(locators.name);
    this.person_name = page.locator(locators.person_name);
    this.selectVehicle = page.locator(locators.selectVehicle);
    this.newStep = page.locator(locators.newStep);
    this.lossCause = page.locator(locators.lossCause);
    this.vehicleCollision = page.locator(locators.vehicleCollision);
    this.whatHappened = page.locator(locators.whatHappened);
    // this.finish = page.locator(locators.finish);
    // this.claim00000007546HasBeenSuccessfullySaved = page.locator(locators.claim00000007546HasBeenSuccessfullySaved);
  }

  private coerceValue(value: unknown): string {
    if (value === undefined || value === null) {
      return '';
    }
    if (typeof value === 'number') {
      return `${value}`;
    }
    if (typeof value === 'string') {
      return value;
    }
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
          if (candidate.trim() !== '') {
            return candidate;
          }
        }
      }
    }
    return this.coerceValue(fallback);
  }

  async setUsername(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.username.waitFor({ state: 'visible', timeout: 30000 });
    await this.username.fill(finalValue);
  }

  async setElement(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.claimcenter.fill(finalValue);
  }

  async setUsername2(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.username2.fill(finalValue);
  }

  async setPassword(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.password.fill(finalValue);
  }

  async setDateInput(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.dateInput.fill(finalValue);
  }

  async setElement2(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.claimcenter.fill(finalValue);
  }

  async setWhatHappened(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.whatHappened.fill(finalValue);
  }

  async setSearch(value: unknown): Promise<void> {
    const finalValue = this.coerceValue(value);
    await this.search.fill(finalValue);
  }

  async applyData(formData: Record<string, any> | null | undefined, keys?: string[], index: number = 0): Promise<void> {
    const fallbackValues: Record<string, string> = {
      "Username": "",
      "Username2": "",
      "element": "",
      "Password": "",
      "date input": "",
      "What Happened?": "",
    };
    const targetKeys = Array.isArray(keys) && keys.length ? keys.map((key) => this.normaliseDataKey(key)) : null;
    const shouldHandle = (key: string) => {
      if (!targetKeys) {
        return true;
      }
      return targetKeys.includes(this.normaliseDataKey(key));
    };
    if (shouldHandle("Username")) {
      const value = this.resolveDataValue(formData, "Username", fallbackValues["Username"] ?? '');
      if (index === 0) {
        await this.setUsername(value);
      } else if (index === 1) {
        // Use Username2 data for the second username field
        const value2 = this.resolveDataValue(formData, "Username2", value);
        await this.setUsername2(value2);
      }
    }
    if (shouldHandle("element")) {
      const value = this.resolveDataValue(formData, "element", fallbackValues["element"] ?? '');
      if (index === 0) {
        await this.setElement(value);
      } else if (index === 1) {
        await this.setElement2(value);
      }
    }
    if (shouldHandle("Password")) {
      await this.setPassword(this.resolveDataValue(formData, "Password", fallbackValues["Password"] ?? ''));
    }
    if (shouldHandle("date input")) {
      await this.setDateInput(this.resolveDataValue(formData, "date input", fallbackValues["date input"] ?? ''));
    }
    if (shouldHandle("What Happened?")) {
      await this.setWhatHappened(this.resolveDataValue(formData, "What Happened?", fallbackValues["What Happened?"] ?? ''));
    }
  }
}

export default Fnolnewflowpage;

