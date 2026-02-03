require("dotenv").config();

const scrapeBookMyShow = require("./scraper/bookmyshow");
const { getExistingEvents, appendEvents } = require("./services/sheetService");
const filterNewEvents = require("./services/dedupeService");

async function run() {
  try {
    console.log("🚀 Scraping started...");

    const scraped = await scrapeBookMyShow(process.env.CITY);
    console.log("Scraped:", scraped.length);

    const existing = await getExistingEvents();
    console.log("Existing rows:", existing.length);

    const existingMap = new Map();
    existing.forEach((row, index) => {
      existingMap.set(row[5], index + 2); // row number in sheet
    });

    const newEvents = [];

    for (const event of scraped) {
      if (!existingMap.has(event.url)) {
        newEvents.push(event);
      }
    }

    await appendEvents(newEvents);

    console.log("New events:", newEvents.length);

    console.log("✅ Process completed.");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

module.exports = run;

if (require.main === module) {
  run();
}

