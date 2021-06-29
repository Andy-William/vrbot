const db = require('./../lib/mongo.js');
const lastReset = require('./../lib/time.js');

module.exports = {
	name: 'cake',
  alias: '^boc$',
	description: 'Battle of Cake reward (SEA)',
	async execute(message, args) {
    message.react('🆗');
    
    // default meme image
    let image = "https://cdn.discordapp.com/attachments/555311795771015193/859330516061650954/triple-chocolate-peanut-butter-layer-cake-18727d0.png";
    const dbImage = await db.get('cake').then(res => res[0]) || {};
   
    // if db image is overridden for the week, use it
    if( dbImage.created_at > new Date ){
      image = dbImage.url;
    }

    return message.channel.send({files: [image]})
	},
};