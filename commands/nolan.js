const db = require('../lib/mongo.js');
const { ApplicationCommandOptionType } = require('discord.js');

async function odds(){
  if( this.odds ) return this.odds;
  const rare = await db.count('cards', {nolan: 1});
  const common = await db.count('cards', {nolan: 4})*4;
  const total = rare+common;
  this.odds = [rare/total, common/total];
  // console.log(this.odds)
  return this.odds
}

async function getNolan(){
  const chance = await odds();
  let random = Math.random();
  let rarity;
  if( random < chance[0] ) rarity = 1
  else rarity = 4

  const card = (await db.getRandom('cards', {nolan: rarity}))[0];
  return card;
}

async function bulkGetNolan(count){
  let odds = {}
  let oddSum = 0
  let cards = await db.get('cards', {nolan: {$ne: null}})
  cards.forEach(card => {
    odds[card.name] = card.nolan
    oddSum += card.nolan
  });

  let resultMvp = {}
  let resultMini = {}
  for( i=0 ; i<count ; i++ ){
    let random = Math.random() * oddSum;
    for(const [card, odd] of Object.entries(odds)){
      if( random < odd ){
        if( odd == 1 ){
          resultMvp[card] = (resultMvp[card] || 0) + 1
        } else {
          resultMini[card] = (resultMini[card] || 0) + 1
        }
        break;
      }
      random -= odd;
    }
  }
  return [resultMvp, resultMini];
}

module.exports = {
	name: 'nolan',
	description: 'Combined Fate Simulator',
  options: [
    {
      type: ApplicationCommandOptionType.Integer,
      name: 'number',
      description: 'Roll how many times? (default: 1)',
      min: 1,
      max: 100,
      required: false
    }
  ],
	async processMessage(message, args) {
    let count = parseInt(args[0]) || 1;
    count = Math.max(Math.min(count,100),1);
    let str = "<:nolan:765856406540124171> Combined Fate Simulator <:nolan:765856406540124171>\n";
    if( count == 1 ){
      const card = await getNolan();
      str += `${message.author.toString()} got **${card.name}** - priced ${(card.price||0).toLocaleString()}\n`;
    } else {
      const [resultMvp, resultMini] = await bulkGetNolan(count)
      str += `${message.author.toString()} rolled ${count}x and got:\n **MVP**\n`;
      for(const [card, num] of Object.entries(resultMvp).sort((a,b)=>b[1]-a[1])){
        str += `${num}x **${card}**\n`
      }
      str += "**Mini**\n"
      for(const [card, num] of Object.entries(resultMini).sort((a,b)=>b[1]-a[1])){
        str += `${num}x **${card}**\n`
      }
    }
    let msgs = str.match(/.{1,1988}(\n|$)/gs); // split message every 2000 chars
    for( let i=0 ; i<msgs.length ; i++ ){
      await message.channel.send(msgs[i])
    }
	},
  async processInteraction(interaction){
    let count = interaction.options.getInteger('number') || 1;
    let str = "<:nolan:765856406540124171> Combined Fate Simulator <:nolan:765856406540124171>\n";
    if( count == 1 ){
      const card = await getNolan();
      str += `${interaction.user.toString()} got **${card.name}** - priced ${(card.price||0).toLocaleString()}\n`;
    } else {
      const [resultMvp, resultMini] = await bulkGetNolan(count)
      str += `${interaction.user.toString()} rolled ${count}x and got:\n**MVP**\n`;
      for(const [card, num] of Object.entries(resultMvp).sort((a,b)=>b[1]-a[1])){
        str += `${num}x **${card}**\n`
      }
      str += "**Mini**\n"
      for(const [card, num] of Object.entries(resultMini).sort((a,b)=>b[1]-a[1])){
        str += `${num}x **${card}**\n`
      }
    }
    let msgs = str.match(/.{1,1988}(\n|$)/gs); // split message every 2000 chars
    for( let i=0 ; i<msgs.length ; i++ ){
      if( i==0 ) await interaction.reply(msgs[i]);
      else await interaction.followUp(msgs[i]);
    }
  }
};
