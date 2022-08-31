const db = require('./reminder.js');
const client = require('./bot.js').client;

module.exports = function(message){
  db.getReminderChannels().then(ids => {
    ids.forEach(id => {
      try{
        client.channels.cache.get(id).send(message).catch(err=>{
          console.log(id);
          console.log(err);
        })
      }
      catch(err){
        console.log(err);
        console.log(id);
      }
    });
  });
}
