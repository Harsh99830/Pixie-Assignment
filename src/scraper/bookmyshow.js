const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

async function scrapeBookMyShow(city) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    await page.goto(
      `https://in.bookmyshow.com/explore/events-${city}`,
      { waitUntil: "networkidle2" }
    );

    await new Promise(r => setTimeout(r, 4000));

    const eventLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href*="/events/"]');
      return Array.from(links)
        .map(a => a.href)
        .filter((v, i, arr) => arr.indexOf(v) === i)
        .slice(0, 10); // limit for performance
    });

    const events = [];

    for (const url of eventLinks) {
      const eventPage = await browser.newPage();
      await eventPage.goto(url, { waitUntil: "networkidle2" });
      await new Promise(r => setTimeout(r, 2000));

      const eventData = await eventPage.evaluate(() => {

        const getText = (selector) =>
          document.querySelector(selector)?.innerText.trim() || "";

        return {
          name: getText("h1"),
          date: getText("[class*='date']"),
          venue: getText("[class*='venue']"),
          category: getText("[class*='category']"),
        };
      });

      events.push({
        ...eventData,
        city: city,
        url: url,
        status: "Active"
      });

      await eventPage.close();
    }

    return events;

  } catch (err) {
    console.error("Scraping error:", err.message);
    return [];
  } finally {
    await browser.close();
  }
}

module.exports = scrapeBookMyShow;
