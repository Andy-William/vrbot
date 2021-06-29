const db = require('./../lib/mongo.js');

const odds = {
  "New Costume": 2,
  "New Headwear": 10,
  "Shard": 10,
  "BDB": 10,
  "Card": 5,
  "Contact": 4,
  "Hairstyle": 4,
  "Food": 5,
  "Currency": 20,
  "Pet": 5,
  "Exp": 5,
  "Praying Card": 5,
  "Zeny+Page": 15
}

// true if category have not uniform odds
const internalOdds = {
  "New Headwear": true,
  "BDB": true,
  "Currency": true,
  "Pet": true,
  "Praying Card": true,
  "Zeny+Page": true
}

module.exports = {
	name: 'feast',
	description: 'Feast Gacha Simulator',
	async execute(message, args) {

    let random = Math.random() * 100;
    let typeResult;
    let result;

    for(const [type, odd] of Object.entries(odds)){
      if( random < odd ){
        typeResult = type
        break;
      }
      random -= odd;
    }

    if( internalOdds[typeResult] ){
      const items = await db.get('feast', {type: typeResult})
      let oddSum = 0
      items.forEach(item=>oddSum+=item.weight);
      random = Math.random() * oddSum;
      for(let item of items){
        if( random < item.weight ){
          result = item.name
          break;
        }
        random -= item.weight;
      }
    }
    else{
      result = (await db.getRandom('feast', {type: typeResult}))[0].name;
    }
    let str = "<:feast:780014200038359040> Feast Gacha Simulator <:feast:780014200038359040>\n";
    str += `${message.author.toString()} got **${result}**${typeResult.match(/^New/)?` (${typeResult})`:''}\n`;

    await message.channel.send(str).catch((err)=>console.log(err));
	},
};
