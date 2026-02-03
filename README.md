# Event Discovery & Tracking Tool

This is a backend tool that automatically discovers events from BookMyShow for a selected city and keeps a Google Sheet updated.

The purpose of this project is to avoid manual tracking of events. It fetches event data, updates changes, and maintains a clean event list automatically.

---

## Features

- Scrapes event data from BookMyShow
- Allows city selection via environment variable
- Stores event data in Google Sheets
- Adds new events
- Updates existing events
- Marks missing events as **Expired**
- Supports scheduled execution using cron

---

## Tech Stack

- Node.js  
- Puppeteer (with stealth plugin)  
- Google Sheets API  
- node-cron  
- dotenv  

---

## Project Structure

pixieBooth/
│
├── src/
│   ├── scraper/
│   ├── services/
│   ├── scheduler/
│   └── index.js
│
├── service-account.json
├── app.js
├── .env
└── package.json

---

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Google Sheets Setup

1. Enable **Google Sheets API** in Google Cloud Console  
2. Create a **Service Account**
3. Download the JSON key
4. Place it in the project root as:

```
service-account.json
```

5. Share your Google Sheet with the service account email (Editor access)

---

## Google Sheet Format

The first row of the sheet must contain:

```
Name | Date | Venue | City | Category | URL | Status | Last Updated
```

---

## Environment Variables

Create a `.env` file in the root folder:

```env
CITY=mumbai
SPREADSHEET_ID=your_google_sheet_id_here
```

You can get the `SPREADSHEET_ID` from the sheet URL:

```
https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
```

---

## ▶ How To Run

### Run Once (Manual Sync)

```bash
node src/index.js
```

### Run With Scheduler (Auto Mode)

```bash
node app.js
```

---

## 🧠 How It Works

- Each event URL is treated as a unique identifier.
- If an event already exists → the row is updated.
- If an event does not exist → a new row is added.
- If an existing event is not found in the latest scrape → it is marked as **Expired**.
- The scheduler can run the sync automatically at fixed intervals.

---

## Notes

BookMyShow uses dynamic rendering and bot detection.  
To handle this, Puppeteer with a stealth plugin is used to simulate real browser behavior.

In a production system, official APIs or partnerships would be preferred over scraping.

---
