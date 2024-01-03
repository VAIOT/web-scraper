import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { join } from 'path';
import { Browser, launch } from 'puppeteer';

const links = new Map<string, boolean>([]);

async function scrapAddress(url: string, browser: Browser) {
  if (links.has(url)) {
    links.set(url, false);
  }

  const currentPage = (await browser.pages())[0];

  console.log(url);
  await currentPage.goto(url);

  // filter urls
  const urls = await currentPage.$$eval(
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
    if (!links.has(url)) {
      links.set(url, true);
    }

    // scrap all sub-pages
    if (links.get(url)) {
      text += await scrapAddress(url, browser);
    }
  }

  const extractedContent = await currentPage.$eval(
    'body',
    (el) => el.innerText,
  );
  text += extractedContent.split('\n').join(' ');

  return text;
}

const scraper: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  context.log('HTTP trigger function processed a request.');
  const page = req.query.page;
  console.log('1');

  let allContent = '';
  try {
    const browser = await launch({
      headless: 'new',
      args: ['--no-sandbox'],
      executablePath: join(
        __dirname,
        '../..',
        'cache/puppeteer/chrome-headless-shell-linux64/chrome-headless-shell',
      ),
    });
    console.log('2');

    allContent = await scrapAddress(page, browser);
    console.log('3');

    await browser.close();
    console.log('4');
  } catch (e) {
    console.log(e);
  }

  context.res = {
    body: allContent,
  };
};

export default scraper;
