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
        if( args[1] == '' ) return message.reply('invalid params. format: `sudo vr url`');
        else{
          const data = {
            url: args[1],
            created_at: reset.nextReset()-1
          }
          db.update('valhalla_map', {level: 0}, data, {upsert: true}).then(()=>{
            message.react('✅');
          })
          return message.channel.send(`VR set to <${args[1]}>`);
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