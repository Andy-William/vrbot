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
	schedule: '30 1 * * *',
	async action() {
    db.get('pets', {}).then(async (res)=>{
      for( let i=0 ; i<res.length ; i++ ){
        const items = await poring.getPrice(res[i].catch)
        if( items.length == 0 ) console.log('failed', res[i].catch)
        items.forEach(item=>{
          item = dbUpdateData(item)
          db.update('pets', item.query, item.data).then(res=>{
            if( res.matchedCount == 1 ) console.log('updated', item.query, res.modifiedCount)
            else console.log('failed', item.query)
          });
        })
        await new Promise(r => setTimeout(r, 5000));
      }
    })
	},
};
