// check if given time is before last RO weekly reset time (5AM monday GMT+7)
function isBeforeLastReset(time){
  const now = new Date;
  const lastReset = now - (now - 338400000) % 604800000;
  return time < lastReset;
}

// number of week since beginning of time
function numberOfWeek(time){
  return Math.floor((time-0+266400000)/604800000);
}

function nextReset(time = new Date){
  return numberOfWeek(time)*604800000+338400000;
}

exports.isOutdated = isBeforeLastReset;
exports.week = numberOfWeek;
exports.nextReset = nextReset;