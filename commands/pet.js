const db = require('../lib/mongo.js');

async function getPets(){
  const data = await db.get('pets', {}, {"_id": 1});
  const pets = {}; // processed pet catch items

  data.forEach(pet=>{
    pets[pet.catch] = {
      name: pet.name,
      unlock: pet.unlock,
      quantity: pet.quantity,
      price: pet.price,
      lastRequest: pet.lastRequest
    };;
  });

  const longestNameLength = Math.max(...Object.values(pets).map(pet=> pet.name.length))
  const longestItemLength = Math.max(...Object.keys(pets).map(item=> item.length))
  const longestPriceLength = Math.max(...Object.values(pets).map(pet=> pet.price.toString().length))

  let str = "Pet Name".padEnd(longestNameLength) + " | " + "Catch Item".padEnd(longestItemLength) + " | Price" + " ".repeat(longestPriceLength*2+3) + "\n"
  str += "-".repeat(str.length-1) + "\n"
  str = "Pet capture item prices - Powered by poring.life\n" + str

  Object.entries(pets).forEach(([item, pet])=>{
    str += pet.name.padEnd(longestNameLength) + " | "
    str += item.padEnd(longestItemLength) + " | "
    str += `${pet.quantity} x ${pet.price.toString().padStart(longestPriceLength)} = `
    str += (pet.quantity*pet.price).toString().padStart(longestPriceLength+1) + "\n"
  });

  return str;
}

module.exports = {
	name: 'pet',
  alias: '^pett+$',
	description: 'Pet List',
	async processMessage(message, args) {
    message.react('🆗');
    const str = await getPets();

    let msgs = str.match(/.{1,1988}(\n|$)/gs); // split message every 2000 chars
    for( let i=0 ; i<msgs.length ; i++ ){
      await message.channel.send("```json\n"+msgs[i]+"```")
    }
	},
  async processInteraction(interaction){
    const str = await getPets();

    let msgs = str.match(/.{1,1988}(\n|$)/gs); // split message every 2000 chars
    for( let i=0 ; i<msgs.length ; i++ ){
      if( i==0 ) await interaction.reply("```json\n"+msgs[i]+"```");
      else await interaction.followUp("```json\n"+msgs[i]+"```");
    }
  }
};
