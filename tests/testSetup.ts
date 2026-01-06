import { test as baseTest } from "@playwright/test";

const test = baseTest.extend({});
// test.afterEach(async ({page}, testInfo) => {
    

// });
export { test, expect, request as playwrightRequest } from '@playwright/test';