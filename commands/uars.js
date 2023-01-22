const { ApplicationCommandOptionType } = require('discord.js');
const { findBestMatch } = require('string-similarity');

const odds = {
  "Giant Dragon Scale 🥳": 2,
  "Valkyrie’s Flying Feather 🥳": 2,
  "Veteran Sword 🥳": 2,
  "Veteran Shield 🥳": 2,
  "Evergreen Mistletoe 😐": 10,
  "Valkyrie’s Gravel 😐": 10,
  "Stone of Meditation 😐": 10,
  "Yggdrasil Amber 😐": 10,
  "Transformation Helmet Shard 😔": 15,
  "Rosy Cloud Yarn 😔": 15,
  "Old Horn 😔": 15,
  "Elven Sacred Tree 😔": 15
}

function getFeast(count){
  let result = {};

  for( i=0 ; i<count ; i++ ){
    let random = Math.random() * 108;
    for(const [relic, odd] of Object.entries(odds)){
      if( random < odd ){
        result[relic] = (result[relic] || 0) + 1
        break;
      }
      random -= odd;
    }
  }

  return result;
}

module.exports = {
	name: 'uars',
	description: 'Ultimate Ancient Relic Shard simulator',
  options: [
    {
      type: ApplicationCommandOptionType.Integer,
      name: 'number',
      description: 'Open how many? (default: 1)',
      min: 1,
      max: 1000,
      required: false
    }
  ],
	async processMessage(message, args) {
    let count = parseInt(args[0]) || 1;
    count = Math.max(Math.min(count,1000),1);
    const result = getFeast(count);

    let str = "<:UltimateAncientRelicShard:1066583960412495872> Ultimate Ancient Relic Shard opening <:UltimateAncientRelicShard:1066583960412495872>\n";
    if( Object.keys(result).length == 1 ){
      str += `${message.author.toString()} got **${Object.keys(result)[0]}**\n`;
    } else {
      str += `${message.author.toString()} opened ${count} and got:\n`;
      for(const [relic, num] of Object.entries(result).sort((a,b)=>b[1]-a[1])){
        str += `${num}x **${relic}**\n`
      }
    }
    return await message.channel.send(str);
	},
  async processInteraction(interaction){
    let count = interaction.options.getInteger('number') || 1;
    const result = getFeast(count);

    let str = "<:UltimateAncientRelicShard:1066583960412495872> Ultimate Ancient Relic Shard opening <:UltimateAncientRelicShard:1066583960412495872>\n";
    if( Object.keys(result).length == 1 ){
      str += `${interaction.user.toString()} got **${Object.keys(result)[0]}**\n`;
    } else {
      str += `${interaction.user.toString()} opened ${count} and got:\n`;
      for(const [relic, num] of Object.entries(result).sort((a,b)=>b[1]-a[1])){
        str += `${num}x **${relic}**\n`
      }
    }
    return await interaction.reply(str);
  }
};
