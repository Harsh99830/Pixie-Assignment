require("dotenv").config();

const scrapeBookMyShow = require("./scraper/bookmyshow");
const {
  getExistingEvents,
  appendEvents,
  updateRow
} = require("./services/sheetService");

async function run() {
  try {
    console.log("🚀 Sync started...");

    const scraped = await scrapeBookMyShow(process.env.CITY);
    console.log("Scraped events:", scraped.length);

    const existing = await getExistingEvents();
    console.log("Existing rows:", existing.length);

    const existingMap = new Map();
    existing.forEach((row, index) => {
      existingMap.set(row[5], { rowNumber: index + 2, data: row });
    });

    const scrapedUrls = new Set();
    let newCount = 0;
    let updateCount = 0;
    let expiredCount = 0;

    for (const event of scraped) {
      scrapedUrls.add(event.url);

      if (existingMap.has(event.url)) {
        const rowNumber = existingMap.get(event.url).rowNumber;

        await updateRow(rowNumber, [
          event.name,
          event.date,
          event.venue,
          event.city,
          event.category,
          event.url,
          "Active",
          new Date().toISOString()
        ]);

        updateCount++;
      } else {
        await appendEvents([event]);
        newCount++;
      }
    }

    for (const [url, info] of existingMap.entries()) {
      if (!scrapedUrls.has(url)) {
        await updateRow(info.rowNumber, [
          info.data[0],
          info.data[1],
          info.data[2],
          info.data[3],
          info.data[4],
          info.data[5],
          "Expired",
          new Date().toISOString()
        ]);
        expiredCount++;
      }
    }

    console.log("New added:", newCount);
    console.log("Updated:", updateCount);
    console.log("Expired marked:", expiredCount);

    console.log("✅ Sync completed.");

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}


module.exports = run;

if (require.main === module) {
  run();
}
