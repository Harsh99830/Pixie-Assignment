const cron = require("node-cron");
const run = require("../index");

cron.schedule("0 */6 * * *", async () => {
  console.log("⏰ Scheduled run...");
  await run();
});
