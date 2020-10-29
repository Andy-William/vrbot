const odds = {
  1: [200],
  2: [125, 75],
  3: [100, 60, 40],
  4: [75, 55, 45, 25],
  5: [50, 60, 50, 25, 15],
  6: [35, 50, 55, 35, 15, 10],
  7: [20, 40, 45, 45, 30, 12, 8],
  8: [10, 25, 40, 45, 40, 24, 12, 4],
  9: [0, 10, 25, 45, 60, 32, 20, 6, 2],
  10: [0, 0, 20, 30, 60, 50, 25, 10, 4, 1],
  11: [0, 0, 10, 20, 50, 64, 34, 13, 6, 2, 1],
  12: [0, 0, 0, 20, 40, 68, 42, 16, 8, 3, 2, 1],
  13: [0, 0, 0, 10, 30, 64, 54, 20, 12, 4, 3, 2, 1],
  14: [0, 0, 0, 0, 24, 56, 60, 28, 16, 6, 4, 3, 2, 1],
  15: [0, 0, 0, 0, 10, 40, 70, 35, 20, 10, 5, 4, 3, 2, 1]
}

module.exports = {
	name: 'extract',
  alias: 're',
	description: 'Oracle Mirror Extraction Simulator',
	async execute(message, args) {
    if( !args[0] ) return message.reply('Usage: `extract <spasi> level`');
    if( args[0] < 1 || args[0] > 15 ) return message.reply('Usage: `level harus 1-15');

    const level = args[0]-0;
    const odd = odds[level];
    let random = Math.random() * 200;
    let result;

    for(const [index, current] of odd.entries()){
      if( random <= current ){
        result = index+1;
        break;
      }
      random -= current;
    }

    let str = `<:ExtractLightCrystal:771330344443838474> ${message.author.toString()} dapat **+${result}**/+${level}${result==level?', gratz!':''} <:ExtractLightCrystal:771330344443838474>\n`;

    await message.channel.send(str).catch((err)=>console.log(err));
	},
};
