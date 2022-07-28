const db = require('./../lib/mongo.js');
const lastReset = require('./../lib/time.js');

async function getCakeUrl(){
  // default image
  let image = "https://media.discordapp.net/attachments/877551130522034257/1002086279799906304/unknown.png";

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
    await message.channel.send({files: [imageUrl]})
	},
  async processInteraction(interaction){
    const imageUrl = await getCakeUrl();
    await interaction.reply({files: [imageUrl]});
  }
};
