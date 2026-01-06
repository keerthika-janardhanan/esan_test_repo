import { Page, TestInfo, test } from '@playwright/test';

export async function captureStepScreenshot(
  page: Page,
  testInfo: TestInfo,
  stepLabel: string
) {
  const screenshot = await page.screenshot();
  await testInfo.attach(stepLabel, {
    body: screenshot,
    contentType: 'image/png',
  });
}

export async function attachScreenshot(stepsname: string, testinfo: any, screenshot: any) {
  await testinfo.attach(stepsname, {
    body: screenshot,
    contentType: 'image/png',
  });
}

export async function namedStep(
  label: string,
  page: Page,
  testInfo: TestInfo,
  action: () => Promise<void>
) {
  await test.step(label, async () => {
    await action();
    const screenshot = await page.screenshot();
    await testInfo.attach(label, {
      body: screenshot,
      contentType: 'image/png',
    });
  });
}
