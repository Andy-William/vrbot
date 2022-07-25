const db = require('./../lib/mongo.js');
const lastReset = require('./../lib/time.js');

async function getCakeUrl(){
  // default meme image
  let image = "https://cdn.discordapp.com/attachments/555311795771015193/859330516061650954/triple-chocolate-peanut-butter-layer-cake-18727d0.png";

  const dbImage = await db.get('cake').then(res => res[0]) || {};

  // if db image is overridden for the week, use it
  if( dbImage.created_at > new Date ){
    image = dbImage.url;
  }

  return image;
}

module.exports = {
	name: 'cake',
  alias: '^boc$',
	description: 'Battle of Cake reward (SEA)',
	async processMessage(message, args) {
    message.react('🆗');
    const imageUrl = await getCakeUrl();
    return message.channel.send({files: [imageUrl]})
	},
  async processInteraction(interaction){
    const imageUrl = await getCakeUrl();
    interaction.reply({files: [imageUrl]});
  }
};