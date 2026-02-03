const cron = require("node-cron");
const run = require("../index");

cron.schedule("0 */6 * * *", () => {
  console.log("Running scheduled job...");
  run();
});
