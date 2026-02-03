const dayjs = require("dayjs");

function markExpired(events) {
  const today = dayjs();

  return events.map(event => {
    if (event.date && dayjs(event.date).isBefore(today)) {
      event.status = "Expired";
    }
    return event;
  });
}

module.exports = markExpired;
