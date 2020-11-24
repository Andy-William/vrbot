const db = require('./../lib/mongo.js');
const reset = require('./../lib/time.js');

const Discord = require('discord.js')
const fetch = require('node-fetch');
const Canvas = require('canvas');
const md5 = require('md5');

function getBase64Image(url){
  return fetch(url).then(resp=>resp.buffer()).then(image=>image.toString('base64'));
}
module.exports = {
	name: 'sudo',
	description: 'Admin Stuff',
	async execute(message, args) {
    if( message.guild.id != '555311795771015189' ) return;
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
              level: bossData[1].replace(/\s/g,''),
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
        if( args[1] == '' ) return message.reply('invalid params. format: `sudo oracle url`');
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
      case 'et':
        if( args[1] == 'reset' ){
          db.delete('et', {created_at: reset.nextReset()-1}).then(()=>{
            message.react('✅');
            message.channel.send(`ET reseted`);
          })
        }
        else if( args[1] != 'mini' && args[1] != 'mvp' ) return message.reply('invalid params. format: `sudo et mini/mvp url` or `sudo et reset`');
        else{
          const data = {
            type: args[1],
            url: args[2],
            created_at: reset.nextReset()-1
          }
          db.update('et', {type: args[1]}, data, {upsert: true}).then(()=>{
            message.react('✅');
            return message.channel.send(`ET(${args[1]}) set to <${args[2]}>`);
          })
        }
        break;
      case 'img':
        const url = args[1];
        getBase64Image(url).then(res=>message.reply('original hash: ' + md5(res)));
        const img = await Canvas.loadImage(url);
        const canvas = Canvas.createCanvas(128, 128);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, img.width, img.height,
                           0, 0, canvas.width, canvas.height);
        const data = canvas.toDataURL('image/png')
        message.reply('converted hash: '+ md5(data));
        const attachment = new Discord.Attachment(canvas.toBuffer(), 'converted.png')
        console.log(canvas.toBuffer())
        message.channel.send('converted', attachment)
      case 'chat':
        break;
    }
	},
};