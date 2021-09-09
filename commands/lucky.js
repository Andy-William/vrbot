const db = require('./../lib/mongo.js');
const cache = require('./../lib/cache.js');

module.exports = {
  name: 'lucky',
  description: 'Lucky Shop Prices',
  async execute(message, args){
    message.react('🆗')
    let limit = parseInt(args[0]) || 100;
    let items = await db.get('items', {type: 'material', luckyQty: {$exists: true}});

    items = items.map(item=>{
      return {
        name: item.name,
        value: item.luckyQty/item.luckyPrice*item.price
      }
    }).sort((a, b)=>{return b.value-a.value});
    
    if( limit > items.length ) limit = items.length;

    let str = "Lucky Shop Item Values (WIP)\n";
    let maxLength = Math.round(items[0].value).toLocaleString().length;

    for( let i=0 ; i<limit ; i++ ){
      str += "> `"+Math.round(items[i].value).toLocaleString().padStart(maxLength)+"` <:Zeny:882599892659355659>/<:EdenCoin:885458266593833030> - " + items[i].name + "\n"
    }

    let msgs = str.match(/.{1,1998}(\n|$)/gs); // split message every 2000 chars
    for( let i=0 ; i<msgs.length ; i++ ){
      await message.channel.send(msgs[i]).catch((err)=>console.log(err))
    }
  }
};
