const db = require('./../lib/mongo.js');

async function odds(){
  if( this.odds ) return this.odds;
  const rare = await db.count('cards', {nolan: 1});
  const common = await db.count('cards', {nolan: 4})*4;
  const total = rare+common;
  this.odds = [rare/total, common/total];
  // console.log(this.odds)
  return this.odds
}

module.exports = {
	name: 'nolan',
	description: 'Combined Fate Simulator',
	async execute(message, args) {
    const chance = await odds();
    let random = Math.random();
    let rarity;
    if( random < chance[0] ) rarity = 1
    else rarity = 4
    
    const card = (await db.getRandom('cards', {nolan: rarity}))[0];
    let str = "💳 Combined Fate Simulator 💳\n";
    str += `${message.author.toString()} dapat **${card.name} Card** - harganya ${(card.price||0).toLocaleString()}\n`;

    await message.channel.send(str).catch((err)=>console.log(err));
	},
};
