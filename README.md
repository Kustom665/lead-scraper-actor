# Lead Scraper Actor

A starter Apify/Crawlee actor for collecting public business lead data from normal websites.

## What it does

- Accepts a list of start URLs
- Crawls same-domain pages
- Extracts public page data
- Finds emails, phone numbers, social links, page titles, headings, and meta descriptions
- Saves clean JSON rows to the Apify/Crawlee dataset

## Install locally

```bash
npm install
npx playwright install --with-deps chromium
```

## Run locally

```bash
npm start
```

## Example input

```json
{
  "startUrls": [
    { "url": "https://example.com" }
  ],
  "maxPages": 25,
  "sameDomain": true
}
```

## Deploy options

### Apify

```bash
npm install -g apify-cli
apify login
apify push
```

### GitHub + Cursor / VS Code

```bash
git clone https://github.com/Kustom665/lead-scraper-actor.git
cd lead-scraper-actor
npm install
npm start
```

## Safe use

Use this for public websites, business directories, your own sites, or sources where scraping is allowed. Do not use it to bypass logins, CAPTCHAs, private APIs, or platform restrictions.
