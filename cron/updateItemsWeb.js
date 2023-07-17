const db = require('../lib/mongo.js');
const poring = require('../lib/poringWeb.js');

function dbUpdateData(item){
  return {
    query: {name: item.name},
    data: {
      price: item.price,
      lastRequest: item.lastRequest
    }
  }
}

module.exports = {
	name: 'update material prices',
	schedule: '* 1-3 * * *',
	// schedule: '* * * * *',
  // now: true,
	async action() {
    // update random item from more than 6 hours ago
    db.getRandom('items', {lastRequest: {$not: {$gt: new Date()/1000-60*60*6}}}).then(async (res)=>{
      if( res.length == 0 ) return;
      const items = await poring.getPrice(res[0].name).catch(e=>{
          console.log(e);
          return [];
        });
      if( items.length == 0 ) console.log('failed', res[0].name)
      else{
        let matched = false;
        items.forEach(item=>{
          if( item.name == res[0].name ){
            matched = true;
            item = dbUpdateData(item)

            if( item.data.price > res.price * 10 ){
              console.log('wrong price detected', item.name, item.data.price, ", skipping", res.price)
              item.data.price = res.price
            }
            db.updateNewer('items', item.query, item.data, item.data.lastRequest).then(res=>{
              if( res.matchedCount == 1 ) console.log('updated', JSON.stringify(item.query), JSON.stringify(item.data), res.modifiedCount)
              else console.log('failed', JSON.stringify(item.query))
            }).catch(e=>console.log(e));
          }
        })
        if( !matched ) console.log('no exact match for ', res[0].name);
      }
    }).catch(e=>console.log(e))
	},
};
