import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from '@azure/functions';
import { join } from 'path';
import { launch } from 'puppeteer';
import { Scraper } from './scraper';

export async function scraper(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log('HTTP trigger function processed a request.');
  const page = request.query.get('page');

  if (!page) return { body: 'Page parameter is missing.' };
  try {
    const browser = await launch({
      headless: 'new',
      executablePath: join(
        __dirname,
        '../..',
        'chrome/chrome-headless-shell-linux64/chrome-headless-shell',
      ),
    });

    const pageContent = await new Scraper(browser).scrapAddress(page);

    await browser.close();

    return { body: pageContent };
  } catch (err) {
    return { body: err };
  }
}

app.http('scraper', {
  methods: ['GET'],
  authLevel: 'function',
  handler: scraper,
});
