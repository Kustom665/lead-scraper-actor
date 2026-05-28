import { Actor } from 'apify';
import { PlaywrightCrawler, Dataset } from 'crawlee';

await Actor.init();

const input = await Actor.getInput() || {};

const {
  startUrls = [{ url: 'https://example.com' }],
  maxPages = 25,
  sameDomain = true
} = input;

const crawler = new PlaywrightCrawler({
  maxRequestsPerCrawl: maxPages,

  async requestHandler({ request, page, enqueueLinks, log }) {
    log.info(`Scraping ${request.url}`);

    await page.waitForLoadState('domcontentloaded');

    const data = await page.evaluate(() => {
      const clean = (t) => t ? t.replace(/\s+/g, ' ').trim() : null;

      const emails = [...document.body.innerText.matchAll(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi)]
        .map(m => m[0]);

      const phones = [...document.body.innerText.matchAll(/\+?\d?[\d\s().-]{7,}/g)]
        .map(m => m[0]);

      return {
        url: location.href,
        title: document.title,
        h1: clean(document.querySelector('h1')?.innerText),
        metaDescription: document.querySelector('meta[name="description"]')?.content || null,

        emails: [...new Set(emails)],
        phones: [...new Set(phones)],

        socialLinks: [...document.querySelectorAll('a[href]')]
          .map(a => a.href)
          .filter(href =>
            href.includes('instagram.com') ||
            href.includes('facebook.com') ||
            href.includes('linkedin.com') ||
            href.includes('twitter.com')
          )
      };
    });

    await Dataset.pushData(data);

    if (sameDomain) {
      await enqueueLinks({
        strategy: 'same-domain'
      });
    }
  },

  failedRequestHandler({ request, log }) {
    log.error(`Failed ${request.url}`);
  }
});

await crawler.run(startUrls);

await Actor.exit();
