import { test, expect, chromium } from '@playwright/test';
import PDFParser from 'pdf2json';
import fs from 'fs';
import pdf from 'pdf-parse';
import path from 'path';

test('Same PDF comparison', async() => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const filePath = path.join(__dirname, 'index.html');
  await page.goto(`file://${filePath}`)
  const iframe = await page.$('iframe');
  await iframe?.evaluate(() => {
    const frame = document.querySelector('iframe');
    frame.src = '../sample-pdf-file.pdf';
  });
  await page.waitForTimeout(5000);
  await page.screenshot({
    path: "screenshots/pageScreenshotDefaultViewPort.png",
  });
  page.setViewportSize({
    width: 1980,
    height: 3000
  })
  await page.waitForTimeout(5000);
  await page.screenshot({
    path: "screenshots/pageScreenshotAfterViewPort.png",
  });
  // expect(await page.screenshot()).toMatchSnapshot();
})
