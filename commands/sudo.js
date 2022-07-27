const db = require('./../lib/mongo.js');
const reset = require('./../lib/time.js');

const fetch = require('node-fetch');
const Canvas = require('canvas');
const md5 = require('md5');

function getBase64Image(url){
  return fetch(url).then(resp=>resp.buffer()).then(image=>image.toString('base64'));
}
module.exports = {
	name: 'sudo',
  listener: /^[^\w]*cake|^$/i,
	description: 'Admin Stuff',
  hidden: true,
	async processMessage(message, args) {
    if( message.channel.id == process.env.DEV_CHANNEL_ID ){
      switch(args[0]){
        case 'vr':
          if( !args[1] || args[1] == '' ) return message.reply('invalid params. format: `sudo vr bosses`');
          else{
            message.react('✅')
            const data = args.slice(1).join(' ');
            const bossRegex = /((?:CN|EN|PH|TH|ID|VN)\s*\d{1,3})(.{15,})(?:\n|$)/gi;
            let bossData;
            let updates = []
            while( bossData = bossRegex.exec(data) ){
              const chData = {
                level: bossData[1].replace(/\s/g,'').toUpperCase(),
                boss: bossData[2],
                actor: message.author.username,
                id: message.guild.id,
                created_at: new Date().getTime()
              }
              updates.push({
                query: {id: chData.id, level: chData.level, actor: chData.actor},
                data: chData
              })
            }
            db.bulkUpdate('valhalla', updates, true).then(()=>message.channel.send(`updated`))
          }
          break;
        case 'oracle':
          if( !args[1] || args[1] == '' ) return message.reply('invalid params. format: `sudo oracle url/reset`');
          if( args[1] == 'reset' ){
            db.delete('oracle', {created_at: reset.nextReset()-1}).then(()=>{
              message.react('✅');
              message.channel.send(`oracle reseted`);
            })
          }
          else{
            const data = {
              url: args[1],
              created_at: reset.nextReset()-1
            }
            db.update('oracle', {}, data, {upsert: true}).then(()=>{
              message.react('✅');
            })
            return message.channel.send(`Oracle set to <${args[1]}>`);
          }
          break;
        case 'cake':
          if( !args[1] || args[1] == '' ) return message.reply('invalid params. format: `sudo cake url/reset`');
          if( args[1] == 'reset' ){
            db.delete('cake', {created_at: reset.nextReset()-1}).then(()=>{
              message.react('✅');
              message.channel.send(`cake reseted`);
            })
          }
          else{
            const data = {
              url: args[1],
              created_at: reset.nextReset()-1
            }
            db.update('cake', {}, data, {upsert: true}).then(()=>{
              message.react('✅');
            })
            return message.channel.send(`Cake set to <${args[1]}>`);
          }
          break;
        case 'et':
          if( args[1] == 'reset' ){
            db.delete('et', {created_at: reset.nextReset()-1}).then(()=>{
              message.react('✅');
              message.channel.send(`ET reseted`);
            })
          }
          else if( !args[1] || args[1] == '' ) return message.reply('invalid params. format: `sudo et url` or `sudo et reset`');
          else{
            const data = {
              url: args[1],
              created_at: reset.nextReset()-1
            }
            db.update('et', {}, data, {upsert: true}).then(()=>{
              message.react('✅');
              return message.channel.send(`ET set to <${args[1]}>`);
            })
          }
          break;
        case 'guildlist':
          let guilds = [];
          require('./../lib/bot.js').client.guilds.cache.forEach((guild) => {
            guilds.push(guild.name)
          });
          const str = guilds.join("\n");
          const msgs = str.match(/.{1,1988}(\n|$)/gs); // split message every 2000 chars
          for( let i=0 ; i<msgs.length ; i++ ){
            await message.channel.send("```json\n"+msgs[i]+"```").catch((err)=>console.log(err));
          }
          break;
        case 'item':
          if( !args[1] || args[1] == '' || parseInt(args[1])==NaN || !args[2] ) return message.reply('invalid params. format: `sudo item price name`');
          const price = parseInt(args[1])
          const name = args.slice(2).join(' ');
          return await db.update('items', {name: name}, {price: price, lastRequest: Math.floor(new Date/1000)}).then((res)=>{
            message.react('✅');
            if( res.matchedCount == 0 ) return message.channel.send(`${name} not found`)
            if( res.modifiedCount == 0 ) return message.channel.send(`${name} not changed`)
            return message.channel.send(`${name} price set to ${price}`);
          })
      }
    }
    else if( message.channel.id == process.env.CAKE_CHANNEL_ID ){
      const attachment =  message.attachments.first()
      if( message.content.match(/^[^\w]*cake/i) ){ // capture weekly cake
        if( attachment && attachment.url ){
          const data = {
            url: attachment.url,
            created_at: reset.nextReset()-1
          }
          db.update('cake', {}, data, {upsert: true}).then(()=>{
            message.react('✅');
          })
          return message.channel.send(`Cake set to <${data.url}>`);
        }
      }
      else if( attachment && attachment.url.match(/oracle/i) ){
        const data = {
          url: attachment.url,
          created_at: reset.nextReset()-1
        }
        db.update('oracle', {}, data, {upsert: true}).then(()=>{
          message.react('✅');
        })
        return message.channel.send(`Oracle set to <${data.url}>`);
      }
    }
	},
};
