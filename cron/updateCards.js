const db = require('./../lib/mongo.js');
const poring = require('./../lib/poring.js');

function dbUpdateData(card){
  let name = card.name.replace(/^[^-]*- /,'').replace(/★/, ' * ').replace(/’/, "'").replace(/ 👍/, '').replace(/  /g,' ')
  return {
    query: {name: name},
    data: {
      price: card.price,
      lastRequest: card.lastRequest,
      volume: card.volume == 'Sold Out' ? 0 : card.volume,
      snapping: -1
    }
  }
}

module.exports = {
	name: 'update card prices',
	schedule: '0 * * * *',
	async action() {
    // update random card from more than 24 hours ago
    db.getRandom('cards', {lastRequest: {$lt: new Date()/1000-60*60*24}}, 20).then(async (res)=>{
      for( let i=0 ; i<res.length ; i++ ){
        const cards = await poring.getPrice(res[i].name)
        if( cards.length == 0 ) console.log('failed', res[i].name)
        cards.forEach(card=>{
          card = dbUpdateData(card)
          db.update('cards', card.query, card.data).then(res=>{
            if( res.matchedCount == 1 ) console.log('updated', card.query, res.modifiedCount)
            else console.log('failed', card.query)
          });
        })
        await new Promise(r => setTimeout(r, 5000));
      }
    })
	},
};
