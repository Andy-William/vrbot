const fs = require('fs');
const cron = require('node-cron');

const commandFiles = fs.readdirSync('./cron').filter(file => file.endsWith('.js'));

module.exports = function(){
  for (const file of commandFiles) {
    const job = require(`./../cron/${file}`);
    cron.schedule(job.schedule, () => {job.action()}, {timezone: "Asia/Bangkok"});
    if( job.now ) job.action();    
    console.log('Initated job ' + job.name + ' with interval ' + job.schedule);
  }
}
