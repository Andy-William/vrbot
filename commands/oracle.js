const fetch = require('node-fetch');
const db = require('./../lib/mongo.js');
const lastReset = require('./../lib/time.js');
const cache = require('./../lib/cache.js');

async function getOracleUrl(){
  // default image
  let image = "https://media.discordapp.net/attachments/877551130522034257/1002086279799906304/unknown.png";

  const dbImage = await db.get('oracle').then(res => res[0]) || {};

  // if db image is overridden for the week, use it
  if( dbImage.created_at > new Date ){
    image = dbImage.url;
  }

  return image;
}

module.exports = {
	name: 'oracle',
  alias: 'ora$',
	description: 'Oracle dungeon bosses (SEA)',
	async processMessage(message, args) {
    message.react('🆗');
    const imageUrl = await getOracleUrl();
    await message.channel.send({files: [imageUrl]})
	},
  async processInteraction(interaction){
    const imageUrl = await getOracleUrl();
    await interaction.reply({files: [imageUrl]});
  }
};
