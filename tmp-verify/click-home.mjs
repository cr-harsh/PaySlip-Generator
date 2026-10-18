import puppeteer from 'puppeteer-core';
import { writeFileSync } from 'node:fs';

const browser = await puppeteer.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: 'new',
  args: ['--hide-scrollbars'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 20000 });
await page.screenshot({ path: 'c:\\PayDraft\\payslip-generator\\tmp-verify\\home-desktop.png' });

await page.click('main button');
await page.waitForSelector('h1', { timeout: 8000 });
const heading = await page.$eval('h1', (el) => el.textContent?.trim() ?? '');
writeFileSync('c:\\PayDraft\\payslip-generator\\tmp-verify\\after-cta.txt', heading);
await page.screenshot({ path: 'c:\\PayDraft\\payslip-generator\\tmp-verify\\workflow-step1.png' });

await page.setViewport({ width: 390, height: 844 });
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0', timeout: 20000 });
await page.screenshot({ path: 'c:\\PayDraft\\payslip-generator\\tmp-verify\\home-mobile.png' });

await browser.close();
console.log('CTA_HEADING=' + heading);
