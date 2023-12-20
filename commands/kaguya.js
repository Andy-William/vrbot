const { ApplicationCommandOptionType } = require('discord.js');

const cost = 18

const zeny = [300000]
const mora = [25,25,25,25,25,25,30,30,30,40]
const dust = [12,12,12,12,12,12,18,18,18,24]
const crystal = [10,10,10,10,10,10,10,10,10,10,14,14,14,14,14,18]
const gram = [20,20,20,20,20,20,20,20,20,20,28,28,28,28,28,35]
const kaguya = [1].concat(Array(399).fill(0))

const odds = {
  "Zeny": zeny,
  "Mora Coin": mora,
  "Oracle Dust": dust,
  "Oracle Crystal": crystal,
  "Gram Dust": gram,
  "Windperch Wyvern - Kaguya": kaguya,
}

function getBox(count){
  let result = {};

  for( i=0 ; i<count ; i++ ){
    for(const [item, choices] of Object.entries(odds)){
      qty = choices[Math.floor(Math.random()*choices.length)]
      result[item] = (result[item] || 0) + qty
    }
  }
  return result;
}

module.exports = {
	name: 'kaguya',
	description: 'Kaguya Box Simulator',
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
    const result = getBox(count);

    let str = "<:BCC:935995477881663488> Celebration Flying Dragon Gift Box opening <:BCC:935995477881663488>\n";
    str += `${message.author.toString()} used ${(cost*count)} BCC to open ${count} box and got:\n`;
    for(const [item, num] of Object.entries(result).sort((a,b)=>b[1]-a[1])){
      if( num > 0 ) str += `${num.toLocaleString()} **${item}**\n`
    }
    return await message.channel.send(str);
	},
  async processInteraction(interaction){
    let count = interaction.options.getInteger('number') || 1;
    const result = getBox(count);

    let str = "<:BCC:935995477881663488> Celebration Flying Dragon Gift Box opening <:BCC:935995477881663488>\n";
    str += `${interaction.user.toString()} used ${cost*count} BCC to open ${count} box and got:\n`;
    for(const [item, num] of Object.entries(result).sort((a,b)=>b[1]-a[1])){
      if( num > 0 ) str += `${num.toLocaleString()} **${item}**\n`
    }
    return await interaction.reply(str);
  }
};
