const db = require('./../lib/mongo.js');
const poring = require('./../lib/poring.js');

function dbUpdateData(card){
  return {
    query: {name: card.name},
    data: {
      price: card.price,
      lastRequest: card.lastRequest,
      volume: card.volume
    }
  }
}

module.exports = {
	name: 'update card prices',
	schedule: '*/15 * * * *',
	async action() {
    const data = await poring.getPrice('card').catch(e=>{
      console.log(e);
      return [];
    });
    const data2 = await poring.getPrice('Chef\'s Blessing').catch(e=>{
      console.log(e);
      return [];
    });

    updates = data.concat(data2).map(d=>dbUpdateData(d))
    const res = await db.bulkUpdate('cards', updates, false)
	},
};
