const db = require('./../lib/mongo.js');
const lastReset = require('./../lib/time.js');

module.exports = {
	name: 'vr',
	description: 'Valhalla Ruins map (SEA)',
	async execute(message, args) {
    message.react('🆗');
    let bosses;
    if( args[0]=='all' ){ // get bosses in all guild
      bosses = await db.get('valhalla', {created_at: {$gte: lastReset.lastReset()}, level: {$ne: 0}}, {level: 1, created_at: 1});
    }
    else{ // get bosses in this guild only
      bosses = await db.get('valhalla', {id: (message.guild||{}).id, created_at: {$gte: lastReset.lastReset()}}, {level: 1, created_at: 1})
    }

    let str = "";
    bosses.forEach(data=>{
      if( data && (data.level == 0 || typeof(data.level)=='string') ){    
        if( data.level != 0 ) str += `**${data.level.toUpperCase()}**: `
        str += `${data.boss.trim()} \`(${data.actor})\`\n`
      }         
    })

    str =  str || (args[0] == 'all' ? 'belum ada' : 'Gunakan `!setvr` untuk set bosnya\nGunakan `!vr all` untuk cek semua channel')

    let msgs = str.match(/.{1,2000}(\n|$)/gs); // split message every 2000 chars
    for( let i=0 ; i<msgs.length ; i++ ){
      await message.channel.send(msgs[i]).catch((err)=>console.log(err));
    }
	},
};