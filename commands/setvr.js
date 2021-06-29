const db = require('./../lib/mongo.js');

module.exports = {
	name: 'setvr',
	description: 'Set boss VR',
	async execute(message, args) {
    if( !message.guild ) return message.reply('No DM for this command!');
    if( args.length < 2 ){
      return message.reply('Usage: `setvr <space> boss names` or `setvr <space> channel <space> boss names`')
    }
    
    const channel = (args[0].match(/(ID|PH|TH|CN|EN|VN)\d{1,3}/i)||[])[0];
    let data;
    if( channel ){
      data = {
        level: channel.toUpperCase(),
        boss: args.slice(1).join(' ').slice(0,150),
        actor: message.author.username,
        id: message.guild.id,
        created_at: new Date().getTime()
      }
    }
    else{
      data = {
        level: 0,
        boss: args.join(' ').slice(0,150),
        actor: message.author.username,
        id: message.guild.id,
        created_at: new Date().getTime()
      }
    }
    
    db.update('valhalla', {id: data.id, level: data.level, actor: data.actor}, data, {upsert: true}).then(()=>{
      message.react('✅');
    })
	},
};