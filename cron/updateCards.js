const db = require('./../lib/mongo.js');
const poring = require('./../lib/poring.js');

function dbUpdateData(card){
  let name = card.name.replace(/^[^-]*- /,'').replace(/★/, ' * ').replace(/’/, "'").replace(/ 👍/, '').replace(/  /g,' ')
  return {
    query: {name: name.match(/^(.*?)(?: Card)?$/i)[1]},
    data: {
      price: card.price,
      lastRequest: card.lastRequest,
      volume: card.volume == 'Sold Out' ? 0 : card.volume,
      snapping: -1
    }
  }
}

module.exports = {
	name: 'wednesday event reminder',
	schedule: '0 1 * * *',
	async action() {
    db.get('cards', {color: {$in: ['mvp', 'mini']}}).then(async (res)=>{
      for( let i=0 ; i<res.length ; i++ ){
        const cards = await poring.getPrice(res[i].name + ' card')
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
