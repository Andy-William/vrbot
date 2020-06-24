const db = require('./../lib/mongo.js');

const chances = {
  '300': [19.5, 80.0, 0.5],
  '210': [11.0, 80.0, 9.0],
  '120': [7.0, 75.0, 18.0],
  '030': [0.0, 75.0, 25.0],
  '201': [0.0, 65.0, 35.0],
  '111': [0.0, 63.0, 37.0],
  '021': [0.0, 60.0, 40.0],
  '102': [0.0, 32.0, 68.0],
  '012': [0.0, 30.0, 70.0],
  '003': [0.0, 0.0, 100.0]
}
                
module.exports = {
	name: 'poring',
  alias: 'kp',
	description: 'King Poring Card Reproduction Simulator',
	async execute(message, args) {
    args = args.join('')

    const white = (args.match(/w/ig)||[]).length;
    const green = (args.match(/g/ig)||[]).length;
    const blue = (args.match(/b/ig)||[]).length;
    if( white + green + blue != 3 ) return await message.reply('Usage: `poring <spasi> kombinasi kartu (W/G/B)`\nContoh: `WWG`')

    const chance = chances[''+white+green+blue];
    let random = Math.random() * 100;
    let color;
    if( chance[0] > random ) color = 'white';
    else if( chance[0]+chance[1] > random ) color = 'green';
    else color = 'blue';
  
    const card = (await db.getRandom('cards', {color: color}))[0];

    let str = "🃏 King Poring Card Reproduction Simulator 🃏\n";
    str += `${message.author.toString()} dapat **${card.name} Card** - harganya ${(card.price||0).toLocaleString()}\n`;

    await message.channel.send(str).catch((err)=>console.log(err));
	},
};
