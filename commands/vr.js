const db = require('../lib/mongo.js');

async function getVRUrl(){
  // default image
  let image = "https://media.discordapp.net/attachments/877551130522034257/1002086279799906304/unknown.png";

  const dbImage = await db.get('vr').then(res => res[0]) || {};

  // if db image is overridden for the week, use it
  if( dbImage.created_at > new Date ){
    image = dbImage.url;
  }

  return image;
}

module.exports = {
	name: 'vr',
	description: 'VR boss (SEA)',
  async processMessage(message, args) {
    message.react('🆗');
    const imageUrl = await getVRUrl();
    await message.channel.send({files: [imageUrl]})
	},
  async processInteraction(interaction){
    const imageUrl = await getVRUrl();
    await interaction.deferReply();
    await interaction.editReply({files: [imageUrl]});
  }
};
