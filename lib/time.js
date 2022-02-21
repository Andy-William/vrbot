// check when is last weekly reset
function lastReset(time = new Date){
  return time - (time - 338400000) % 604800000;
}

// check if given time is before last RO weekly reset time (5AM monday GMT+7)
function isBeforeLastReset(time){
  return time < lastReset;
}

// number of week since beginning of time
function numberOfWeek(time){
  return Math.floor((time-0+266400000)/604800000);
}

function nextReset(time = new Date){
  return numberOfWeek(time)*604800000+338400000;
}

function serverHour(time = new Date){
  return (time.getUTCHours()+7)%24;
}

exports.lastReset = lastReset;
exports.isOutdated = isBeforeLastReset;
exports.week = numberOfWeek;
exports.nextReset = nextReset;
exports.currentHour = serverHour;