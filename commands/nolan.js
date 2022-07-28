const db = require('../lib/mongo.js');

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

module.exports = {
	name: 'nolan',
	description: 'Combined Fate Simulator',
	async processMessage(message, args) {
    const card = await getNolan();
    let str = "<:nolan:765856406540124171> Combined Fate Simulator <:nolan:765856406540124171>\n";
    str += `${message.author.toString()} got **${card.name}** - priced ${(card.price||0).toLocaleString()}\n`;
    await message.channel.send(str);
	},
  async processInteraction(interaction){
    const card = await getNolan();
    let str = "<:nolan:765856406540124171> Combined Fate Simulator <:nolan:765856406540124171>\n";
    str += `${interaction.user.toString()} got **${card.name}** - priced ${(card.price||0).toLocaleString()}\n`;
    await interaction.reply(str);
  }
};
