const { google } = require("googleapis");
const path = require("path");
require("dotenv").config();

async function getSheetsInstance() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "../../service-account.json"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
}

async function getExistingEvents() {
  const sheets = await getSheetsInstance();

  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "Sheet1!A2:H"
  });

  return res.data.values || [];
}

async function appendEvents(events) {
  if (events.length === 0) return;

  const sheets = await getSheetsInstance();

  const values = events.map(e => [
    e.name,
    e.date,
    e.venue,
    e.city,
    e.category,
    e.url,
    e.status,
    new Date().toISOString()
  ]);

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: "Sheet1!A:H",
    valueInputOption: "RAW",
    requestBody: { values }
  });
}

async function updateEventStatus(rowNumber, status) {
  const sheets = await getSheetsInstance();

  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.SPREADSHEET_ID,
    range: `Sheet1!G${rowNumber}`,
    valueInputOption: "RAW",
    requestBody: {
      values: [[status]]
    }
  });
}


module.exports = { getExistingEvents, appendEvents, updateEventStatus };

