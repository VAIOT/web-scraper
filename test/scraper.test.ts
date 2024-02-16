import { Scraper } from '../main/scraper';

jest.mock('puppeteer', () => ({
  Browser: jest.fn(),
}));

describe('scraper function', () => {
  let browserMock: any;
  const url = 'https://example.com';
  const urls = [
    { href: 'https://example.com/page1' } as HTMLAnchorElement,
    { href: 'https://example.com/page2' } as HTMLAnchorElement,
  ];
  let scraper: Scraper;

  beforeAll(() => {
    const mockPage = {
      goto: jest.fn().mockResolvedValue(undefined),
      $$eval: jest.fn().mockImplementation(() => {
        return Promise.resolve([
          'https://example.com/page1',
          'https://example.com/page2',
        ]);
      }),
      $eval: jest.fn().mockResolvedValue('Extracted content'),
    };

    browserMock = {
      pages: jest.fn().mockResolvedValue([mockPage]),
    };
  });

  beforeEach(() => {
    scraper = new Scraper(browserMock);
  });

  it('should return example.com contents', async () => {
    // Act
    const result = await scraper.scrapAddress(url);
    // Assert
    // We are testing example.com, example.com/page1 and example.com/page2
    expect(result).toEqual(
      'Extracted content Extracted content Extracted content',
    );
  });

  it('should return links', async () => {
    const badLink = { href: 'https://exampel.com/page1' } as HTMLAnchorElement;
    const allLinks = [...urls, badLink];
    const filteredUrls = await scraper.filterUrls(allLinks, url);
    expect(filteredUrls).toEqual([
      'https://example.com/page1',
      'https://example.com/page2',
    ]);
  });
});
