const fs = require('fs');
const db = require('./../lib/mongo.js');
const poporing = require('./../lib/poporing.js');

module.exports = {
	name: 'pet',
  alias: '^pett+$',
	description: 'Pet List',
	async execute(message, args) {
    message.react('🆗');
    
    console.log('querying data...');
    const data = await db.get('pets', {}, {"_id": 1});
    console.log('query done');

    const pets = {}; // processed pet catch items
    let updates = []; // list of outdated prices
    const someTimeAgo = Number(new Date())/1000 - 10800; // 3 hours ago

    data.forEach(pet=>{
      pets[pet.catch] = {
        name: pet.name,
        unlock: pet.unlock,
        quantity: pet.quantity,
        price: pet.price,
        lastRequest: pet.lastRequest
      };
      if( !pet.lastRequest || pet.lastRequest < someTimeAgo ) updates.push(pet.catch);
    });

    if( updates.length > 0 ){
      const prices = await poporing.bulkGetPrice(updates);

      let bulkUpdateQuery = []
      prices.forEach(p=>{
        const item = p.name;
        pets[item].price = p.price||'???';
        pets[item].lastRequest = p.lastRequest;
        bulkUpdateQuery.push({
          query: {catch: item},
          data: pets[item]
        });
      })
      db.bulkUpdate('pets', bulkUpdateQuery);
    }

    const longestNameLength = Math.max(...Object.values(pets).map(pet=> pet.name.length))
    const longestItemLength = Math.max(...Object.keys(pets).map(item=> item.length))
    const longestPriceLength = Math.max(...Object.values(pets).map(pet=> pet.price.toString().length))
    
    let str = "Pet Name".padEnd(longestNameLength) + " | " + "Catch Item".padEnd(longestItemLength) + " | Price" + " ".repeat(longestPriceLength*2+3) + "\n"
    str += "-".repeat(str.length-1) + "\n"

    Object.entries(pets).forEach(([item, pet])=>{
      str += pet.name.padEnd(longestNameLength) + " | "
      str += item.padEnd(longestItemLength) + " | "
      str += `${pet.quantity} x ${pet.price.toString().padStart(longestPriceLength)} = `
      str += (pet.quantity*pet.price).toString().padStart(longestPriceLength+1) + "\n"
    });

    let msgs = str.match(/.{1,1988}(\n|$)/gs); // split message every 2000 chars
    for( let i=0 ; i<msgs.length ; i++ ){
      await message.channel.send("```json\n"+msgs[i]+"```").catch((err)=>console.log(err));
    }
	},
};
