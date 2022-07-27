const db = require('./../lib/mongo.js');
const cache = require('./../lib/cache.js');
const { ApplicationCommandOptionType } = require('discord.js');

async function getLuckyList(limit){
  let items = await db.get('items', {type: 'material', luckyQty: {$exists: true}});
  items = items.map(item=>{
    return {
      name: item.name,
      value: item.luckyQty/item.luckyPrice*item.price,
      lastRequest: item.lastRequest,
    }
  }).sort((a, b)=>{return b.value-a.value});
  if( limit > items.length ) limit = items.length;

  let str = "Lucky Shop Item Values\n";
  const longestPriceLength = Math.round(items[0].value).toLocaleString().length;
  const longestItemLength = Math.max(...items.map(item=> item.name.length));

  for( let i=0 ; i<limit ; i++ ){
    str += `> \`${Math.round(items[i].value).toLocaleString().padStart(longestPriceLength)}\` <:Zeny:882599892659355659>/<:EdenCoin:885458266593833030> \`${items[i].name.padEnd(longestItemLength)}\` ${Math.round((Date.now()/1000-items[i].lastRequest)/360)/10} hours ago\n`
  }

  return str;
}

module.exports = {
  name: 'lucky',
  description: 'Lucky Shop Prices',
  options: [
    {
      type: ApplicationCommandOptionType.Integer,
      name: 'limit',
      description: 'Items to fetch (default: 15)',
      min: 1,
      required: false
    }
  ],
  async processMessage(message, args){
    message.react('🆗')
    const limit = parseInt(args[0]) || 100;
    const str = await getLuckyList(limit)

    let msgs = str.match(/.{1,1998}(\n|$)/gs); // split message every 2000 chars
    for( let i=0 ; i<msgs.length ; i++ ){
      await message.channel.send(msgs[i])
    }
  },
  async processInteraction(interaction){
    const limit = interaction.options.getInteger('limit')||15;
    const str = await getLuckyList(limit);
    let msgs = str.match(/.{1,1998}(\n|$)/gs); // split message every 2000 chars
    for( let i=0 ; i<msgs.length ; i++ ){
      if( i==0 ) await interaction.reply(msgs[i]);
      else await interaction.followUp(msgs[i]);
    }
  }
};
