import { Browser } from 'puppeteer';

export class Scraper {
  private links = new Map<string, boolean>([]);

  constructor(private readonly browser: Browser) {}

  async filterUrls(links: HTMLAnchorElement[], url: string) {
    const allLinks = links.map((a) => a.href);
    const uniqueLinks = [...new Set(allLinks)];

    // match links with a slash, without id tags and dots in path (avoiding files)
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
  }

  async scrapAddress(url: string) {
    if (this.links.has(url)) {
      this.links.set(url, false);
    }

    const currentPage = (await this.browser.pages())[0];
    await currentPage.goto(url);

    // filter urls
    const urls = await currentPage.$$eval('a[href]', this.filterUrls, url);

    let text = '';

    for (const url of urls) {
      if (!this.links.has(url)) {
        this.links.set(url, true);
      }

      // scrap all sub-pages
      if (this.links.get(url)) {
        text += await this.scrapAddress(url);
        text += ' ';
      }
    }

    const extractedContent = await currentPage.$eval(
      'body',
      (el) => el.innerText,
    );
    text += extractedContent.split('\n').join(' ');

    return text;
  }
}
