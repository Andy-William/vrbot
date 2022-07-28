const db = require('../lib/mongo.js');
const poring = require('../lib/poringWeb.js');

function dbUpdateData(card){
  return {
    query: {name: card.name},
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
	schedule: '* 4-23 * * *',
	async action() {
    // update random card from more than 6 hours ago
    db.getRandom('cards', {lastRequest: {$not: {$gt: new Date()/1000-60*60*6}}}).then(async (res)=>{
      for( let i=0 ; i<res.length ; i++ ){
        const cards = await poring.getPrice(res[i].name).catch(e=>{
          console.log(e);
          return [];
        });
        if( cards.length == 0 ) console.log('failed', res[i].name)
        cards.forEach(card=>{
          card = dbUpdateData(card)
          db.updateNewer('cards', card.query, card.data, card.data.lastRequest).then(res=>{
            if( res.matchedCount == 1 ) console.log('updated', JSON.stringify(card.query), res.modifiedCount)
            else console.log('failed', JSON.stringify(card.query))
          }).catch(e=>console.log(e));
        })
      }
    }).catch(e=>console.log(e))
	},
};
