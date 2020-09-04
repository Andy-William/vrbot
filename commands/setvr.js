const db = require('./../lib/mongo.js');

const levels = [40,60,80,100,120]

module.exports = {
	name: 'setvr',
  listener: /^vr\s*(\d+)\s*:(.*)/i,
	description: 'Set boss VR',
	async execute(message, args) {
    if( args.length < 2 ){
      return message.reply('Usage: `setvr <spasi> level <spasi> bossnya`')
    }
    
    const level = parseInt(args[0]);
    if( !message.guild ) return;
    if( !levels.includes(level) ) return message.reply('mana ada VR level ' + args[0]);
    
    const data = {
      level: level,
      boss: args.slice(1).join(' '),
      actor: message.author.username,
      id: message.guild.id,
      created_at: new Date().getTime()
    }
    db.update('valhalla', {id: data.id, level: data.level, actor: data.actor}, data, {upsert: true}).then(()=>{
      message.react('✅');
    })
	},
};