const db = require('./../lib/mongo.js');
const fetch = require('node-fetch');
const cache = require('./../lib/cache.js');

const cardUrl = "https://poring.life/?&server=el&q=cards"

const colorMap = {
  '#727272': '⬜',
  '#66BB6A': '🟩',
  '#90': '🟦',
  '#BD93F9': '🟪'
}
const gramMap = {
  '⬜': 10,
  '🟩': 20,
  '🟦': 50
}

// convert format
function dbUpdateData(card){
  let name = card.name.replace(/^[^-]*- /,'').replace(/★/, ' * ').replace(/’/, "'").replace(/ 👍/, '').replace(/  /g,' ')
  return {
    query: {name: name.match(/^(.*?)(?: Card)?$/)[1]},
    data: {
      price: card.price,
      lastRequest: card.lastRequest,
      volume: card.volume,
      snapping: -1
    }
  }
}

module.exports = {
  name: 'card',
  alias: '^cards$',
  description: 'King Poring Cards Prices',
  async execute(message, args){
    message.react('🆗');
    console.log('querying data...');

    const cards = cache.get(cardUrl) || await fetch(cardUrl).then(res => res.text()).then(data=>{
      const colorRegex = /border-color:(#[\dA-F]+)/g;
      const nameRegex = /x.com\/i[^<]*<h6>([^<]*)/g;
      const priceRegex = /Price<.*?<span>([^<]*)/gs;
      const volumeRegex = /Quantity<.*?<span>([^<]*)/gs;
      const lastUpdatedRegex = /Last checked([^<]*)/g;
      let cards = [];
      let match;
      let minGram = 100000000;
      let bulkUpdateQuery = []; // update the database

      while( match = colorRegex.exec(data) ) cards.push({color: colorMap[match[1]]});
      for( let i=0 ; match = nameRegex.exec(data) ; i++ ) cards[i].name = match[1];
      for( let i=0 ; match = priceRegex.exec(data) ; i++ ){
        cards[i].price = match[1];
        const price = parseInt(cards[i].price.replace(/,/g,''));
        const gram = gramMap[cards[i].color];
        if( gram && price ){
          cards[i].gram = (price+10000)/gram;
          if( cards[i].gram < minGram ) minGram = cards[i].gram;
        }
      }
      for( let i=0 ; match = volumeRegex.exec(data) ; i++ ) cards[i].volume = match[1];
      for( let i=0 ; match = lastUpdatedRegex.exec(data) ; i++ ) cards[i].lastRequest = Number(new Date(match[1]))/1000;
      
      cards.forEach((card)=>{
        if( card.gram == minGram ) card.minGram = true;
        bulkUpdateQuery.push(dbUpdateData(card))
      })
      cache.set(cardUrl, cards, 600);
      db.bulkUpdate('cards', bulkUpdateQuery);
      return cards;
    }).catch((err)=>console.log(err));

    let str = "Cheap Card Prices - Powered by poring.life\n👍: best gram dust value\n";
    if( cards ){
      cards.forEach((card)=>{
        str += `${card.color}${card.price} - ${card.name}${card.minGram?' 👍':''}\n`
      })
    }

    let msgs = str.match(/.{1,1988}(\n|$)/gs); // split message every 2000 chars
    for( let i=0 ; i<msgs.length ; i++ ){
      await message.channel.send("```json\n"+msgs[i]+"```").catch((err)=>console.log(err));
    }
  }
};
