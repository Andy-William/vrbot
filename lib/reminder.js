const db = require('./mongo.js');

async function setChannel(id, state){
  db.update('channels', {id: id}, {reminder: state}, {upsert: true});
}

async function getChannel(){
  const data = await db.get('channels', {reminder: true});
  return data.map(d=>d.id)
}

exports.set = setChannel
exports.getReminderChannels = getChannel
