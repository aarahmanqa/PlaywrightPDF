import { test, expect, chromium } from '@playwright/test';
import PDFParser from 'pdf2json';
import fs from 'fs';
import pdf from 'pdf-parse';
import path from 'path';


test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('PDF validation', async ({ page }) => {
  let pdfContent = await getPDFContents("./cashdeficiency.pdf")
  console.log(pdfContent)
});

test('PDF validation by PDF Parser', async ({ page }) => {
  var dataBuffer = fs.readFileSync('./cashdeficiency.pdf')
  await pdf(dataBuffer).then(data => {
    fs.writeFileSync('actual.txt', data.text);
  })
})

test('PDF validation by PDF Compare', async ({ page }) => {
  const ComparePdf = require("compare-pdf");
  const comparisonResults = await new ComparePdf()
      .actualPdfFile('./cashdeficiency.pdf')
      .baselinePdfFile('./cashdeficiency.pdf')
      .compare();
  console.log(comparisonResults)
})

async function getPDFContents(pdfFilePath: string): Promise<any> {
  let pdfParser = new PDFParser();
  return new Promise((resolve, reject) => {
    pdfParser.on('pdfParser_dataError', (pdfData) =>
      reject(pdfData)
    );
    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      resolve(pdfData);
    });

    pdfParser.loadPDF(pdfFilePath);
  });
}

// let iframe = `<iframe src="${expPdf}#zoom=100" style="width: 100%;height:100%;border: none;"></iframe>`;
  // let iframe = `<iframe src="${expPdf}"></iframe>`;
  // await page.setContent(iframe);

test('Same PDF comparison', async() => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const filePath = path.join(__dirname, 'index.html');
  await page.goto(`file://${filePath}`)
  await page.waitForTimeout(10000)
  // const iframe = await page.$('iframe');
  // await iframe?.evaluate(() => {
  //   const frame = document.querySelector('iframe');
  //   frame.src = '../cashdeficiency.pdf';
  // });
  // await page.waitForTimeout(10000);
  // await page.screenshot({
  //   path: "screenshots/pageScreenshotDefaultViewPort.png",
  //   type: "jpeg",
  //   omitBackground: true,

  // });
  // await iframe?.screenshot({
  //   path: "screenshots/iframeScreenshotDefaultViewPort.png",
  //   omitBackground: true
  // });
  // await page.setViewportSize({width:1980, height:3000})
  // await iframe?.evaluate(() => {
  //   const frame = document.querySelector('iframe');
  //   frame.src = '../cashdeficiency.pdf';``
  // });
  // await page.waitForTimeout(10000);
  // await page.screenshot({
  //   path: "screenshots/pageScreenshotChangedViewPort.png"
  // });
  // await iframe.screenshot({
  //   path: "screenshots/iframeScreenshotChangedViewPort.png"
  // });
  expect(await page.screenshot()).toMatchSnapshot();
})
