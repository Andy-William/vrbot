const db = require('./../lib/mongo.js');
const poring = require('./../lib/poring.js');

function dbUpdateCard(card){
  return {
    query: {name: card.name},
    data: {
      price: card.price,
      lastRequest: card.lastRequest,
      volume: card.volume
    }
  }
}

function dbUpdatePet(item){
  return {
    query: {catch: item.name},
    data: {
      price: item.price,
      lastRequest: item.lastRequest
    }
  }
}

function dbUpdateItem(item){
  return {
    query: {name: item.name},
    data: {
      price: item.price,
      lastRequest: item.lastRequest
    }
  }
}
module.exports = {
	name: 'update card prices',
	schedule: '58 * * * *',
  now:true,
	async action() {
    const data = await poring.getPrice('all_items').catch(e=>{
      console.log(e);
      return [];
    });
    return;

    let cardUpdates = []
    let petUpdates = []
    let itemUpdates = []

    let all = new Set()
  
    data.forEach(d=>{
      if( d.id == 700142 ) return; // fake ice cube
      if( all.has(d.name) ) console.log('duplicate: ' + d.name);
      else all.add(d.name);
      switch(d.category){
        case 'card':
          cardUpdates.push(dbUpdateCard(d));
          break;
        case 'pet':
          petUpdates.push(dbUpdatePet(d));
          break;
        case 'blueprint':
        case 'item':
        // case 'potion':
        case 'consumable':
        // case 'mount':
        case 'weapon':
        case 'offhand':
        case 'armor':
        case 'garment':
        case 'footgear':
        case 'accessory':
        // case 'headwear':
        // case 'face':
        // case 'back':
        // case 'mouth':
        // case 'tail':
        // case 'costume':
        // case 'premium':
          itemUpdates.push(dbUpdateItem(d));
          break;
        default:
          // console.log(d)
      }
    })
    
    console.log(cardUpdates.length, petUpdates.length, itemUpdates.length)

    await db.bulkUpdate('cards', cardUpdates, false);
    await db.bulkUpdate('pets', petUpdates, false);
    await db.bulkUpdate('items', itemUpdates, false);
	},
};
