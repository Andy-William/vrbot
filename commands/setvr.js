const db = require('./../lib/mongo.js');

module.exports = {
	name: 'setvr',
	description: 'Set boss VR',
	async execute(message, args) {
    if( !message.guild ) return message.reply('Tidak bisa DM!');
    if( args.length < 2 ){
      return message.reply('Usage: `setvr <spasi> bossnya` atau `setvr <spasi> channel <spasi> bossnya`')
    }
    
    const channel = args[0];
    let data;
    if( channel.match(/(ID|PH|TH|CN|EN)\d+/) ){
      data = {
        level: channel,
        boss: args.slice(1).join(' '),
        actor: message.author.username,
        id: message.guild.id,
        created_at: new Date().getTime()
      }
    }
    else{
      data = {
        level: 0,
        boss: args.join(' '),
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