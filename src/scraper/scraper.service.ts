import { Injectable, Scope } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';

@Injectable({ scope: Scope.REQUEST })
export class ScraperService {
  private browser: Browser;
  private currentPage: Page;
  private links = new Map<string, boolean>([]);

  constructor() {}

  async scrapAddress(url: string) {
    if (this.links.has(url)) {
      this.links.set(url, false);
    }

    this.currentPage = (await this.browser.pages())[0];

    await this.currentPage.goto(url);

    // filter urls
    const urls = await this.currentPage.$$eval(
      'a[href]',
      (links, url) => {
        const allLinks = links.map((a) => a.href);
        const uniqueLinks = [...new Set(allLinks)];

        // match links beginning with the specified url, starts with a slash, without id tags in uri, and without dots in path (avoiding files)
        return uniqueLinks.filter(
          (link) =>
            (link.includes(url) || link.startsWith('/')) &&
            !link.includes('#') &&
            !link
              .replace(/^https?:\/\//, '')
              .split('/')
              .slice(1)
              .join('/')
              .includes('.'),
        );
      },
      url,
    );

    let text = '';
    for (const url of urls) {
      if (!this.links.has(url)) {
        this.links.set(url, true);
      }

      // scrap all sub-pages
      if (this.links.get(url)) {
        text += await this.scrapAddress(url);
      }
    }

    const extractedContent = await this.currentPage.$eval(
      'body',
      (el) => el.innerText,
    );
    text += extractedContent.split('\n').join(' ');

    return text;
  }

  async scrap(url: string) {
    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox'],
    });

    const allContent = await this.scrapAddress(url);

    await this.browser.close();
    return allContent;
  }
}
