function filterNewEvents(scrapedEvents, existingRows) {
  const existingUrls = new Set(existingRows.map(row => row[5]));
  return scrapedEvents.filter(event => !existingUrls.has(event.url));
}

module.exports = filterNewEvents;
