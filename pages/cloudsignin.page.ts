import { Page, Locator } from "@playwright/test";
import cloudsigninx from "../locators/cloudsignin.ts";

class CloudsigninP {
  page: Page;
  username: Locator;
  password: Locator;
  next: Locator;

  constructor(page: Page) {
    this.page = page;

    this.username = this.page.locator(cloudsigninx.username);
    this.password = this.page.locator(cloudsigninx.password);
    this.next = this.page.locator(cloudsigninx.next);
  }

  async goto() {
    await this.page.goto("https://fa-esfe-dev19-saasfademo1.ds-fa.oraclepdemos.com", { waitUntil: "domcontentloaded" });

    this.page.on("requestfailed", request => {
      console.log(`❌ Failed request: ${request.url()} - ${request.failure()?.errorText}`);
    });
  }

  async login(testData: any) {
    const userId = String(testData.Username ?? "");
    const password = String(testData.Password ?? "");

    if (!userId) {
      throw new Error("Username is missing in test data");
    }

    if (!password) {
      throw new Error("Password is missing in test data");
    }

    await this.username.waitFor({ state: "visible" });
    await this.username.fill(userId);

    await this.password.waitFor({ state: "visible" });
    await this.password.fill(password);

    await this.page.screenshot({ path: "screenshots/login.png", fullPage: true });

    await this.next.waitFor({ state: "visible" });
    await this.next.click();
  }
}

export default CloudsigninP;
