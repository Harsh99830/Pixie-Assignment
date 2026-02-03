const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

async function scrapeBookMyShow(city) {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();

    await page.goto(
      `https://in.bookmyshow.com/explore/events-${city}`,
      { waitUntil: "networkidle2" }
    );

    await new Promise(resolve => setTimeout(resolve, 5000));

    const events = await page.evaluate((cityName) => {
      const cards = document.querySelectorAll('a[href*="/events/"]');

      return Array.from(cards)
        .slice(0, 20)
        .map(card => ({
          name: card.innerText.trim() || "Event",
          date: "",
          venue: "",
          city: cityName,
          category: "General",
          url: card.href,
          status: "Active"
        }));
    }, city);

    return events;

  } catch (err) {
    console.error("Scraping error:", err.message);
    return [];
  } finally {
    await browser.close();
  }
}

module.exports = scrapeBookMyShow;
