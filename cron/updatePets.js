const db = require('./../lib/mongo.js');
const poring = require('./../lib/poring.js');

function dbUpdateData(item){
  return {
    query: {catch: item.name},
    data: {
      price: item.price,
      lastRequest: item.lastRequest
    }
  }
}

module.exports = {
	name: 'update pet prices',
	schedule: '1-59/2 * * * *',
	async action() {
    // update random pets from more than 6 hours ago
    db.getRandom('pets', {lastRequest: {$lt: new Date()/1000-60*60*6}}).then(async (res)=>{
      for( let i=0 ; i<res.length ; i++ ){
        const items = await poring.getPrice(res[i].catch).catch(e=>{
          console.log(e);
          return [];
        });
        if( items.length == 0 ) console.log('failed', res[i].catch)
        items.forEach(item=>{
          item = dbUpdateData(item)
          db.update('pets', item.query, item.data).then(res=>{
            if( res.matchedCount == 1 ) console.log('updated', item.query, res.modifiedCount)
            else console.log('failed', item.query)
          }).catch(e=>console.log(e));
        })
      }
    }).catch(e=>console.log(e))
	},
};
