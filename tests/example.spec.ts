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
  page.setViewportSize({
    width: 1200,
    height: 2000
  })
  await page.goto(`file://${filePath}`)
  const iframe = await page.$('iframe');
  await iframe?.evaluate(() => {
    const frame = document.querySelector('iframe');
    frame.src = '../sample-pdf-file.pdf';
  });
  await page.waitForTimeout(5000);
  await page.screenshot({
    path: "screenshots/pageScreenshotAfterViewPort.png",
  });
  expect(await page.screenshot()).toMatchSnapshot();
})
