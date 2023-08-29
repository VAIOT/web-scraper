import { Injectable, Scope } from '@nestjs/common';
import puppeteer, { Browser } from 'puppeteer';

@Injectable({ scope: Scope.REQUEST })
export class ScraperService {
  private browserPromise: Promise<Browser>;

  constructor() {
    this.browserPromise = puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox'],
    });
  }

  async scrapPage(url: string) {
    const browser = await this.browserPromise;
    const page = (await browser.pages())[0];

    await page.goto(url);
    const extractedContent = await page.$eval('body', (el) => el.innerText);
    const text = extractedContent.split('\n').join(' ');
    await browser.close();

    return text;
  }
}
