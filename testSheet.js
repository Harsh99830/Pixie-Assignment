require("dotenv").config();
const { google } = require("googleapis");
const path = require("path");

async function testConnection() {
  const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, "service-account.json"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"]
  });

  const client = await auth.getClient();
  const sheets = google.sheets({ version: "v4", auth: client });

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SPREADSHEET_ID,
      range: "Sheet1!A:H",
      valueInputOption: "RAW",
      requestBody: {
        values: [
          [
            "Test Event",
            "2026-02-05",
            "Test Venue",
            "Mumbai",
            "Music",
            "https://test.com",
            "Active",
            new Date().toISOString()
          ]
        ]
      }
    });

    console.log("✅ Google Sheet Connected Successfully!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

testConnection();
