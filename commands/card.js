const db = require('./../lib/mongo.js');
const fetch = require('node-fetch');
const cache = require('./../lib/cache.js');

const cardUrl = "https://poring.life/?&server=el&q=gramdust"

const colorMap = {
  '#727272': '⬜',
  '#66BB6A': '🟩',
  '#90caf9': '🟦',
  '#BD93F9': '🟪'
}
const gramMap = {
  '⬜': 10,
  '🟩': 20,
  '🟦': 50,
  '🟪': 100
}

// convert format
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
  name: 'card',
  alias: '^cards$',
  description: 'King Poring Cards Prices',
  async execute(message, args){
    message.react('🆗');
    args = args.join('');
    let str = '';

    let query = {color: {$in: []}};
    if( args.match(/putih|white/i) ) query.color.$in.push('white');
    if( args.match(/hijau|green|ijo/i) ) query.color.$in.push('green');
    if( args.match(/biru|blue/i) ) query.color.$in.push('blue');
    if( args.match(/ungu|purple/i) ) query.color.$in.push('purple');
    if( args.match(/mini/i) ) query.color.$in.push('mini');
    if( args.match(/mvp/i) ) query.color.$in.push('mvp');
    if( args.match(/haute|craft/i) ) query.color.$in.push('haute');

    if( query.color.$in.length == 0 ){ // get cheap cards
      const cards = cache.get(cardUrl) || await fetch(cardUrl).then(res => res.text()).then(data=>{
        const colorRegex = /border-color:(#[\dA-F]+)/gi;
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
          cards[i].price = parseInt(match[1].replace(/,/g,''));
          const price = cards[i].price;
          const gram = gramMap[cards[i].color];
          if( gram && price ){
            cards[i].gram = (price+10000)/gram;
            if( cards[i].gram < minGram ) minGram = cards[i].gram;
          }
        }
        for( let i=0 ; match = volumeRegex.exec(data) ; i++ ) cards[i].volume = match[1];
        for( let i=0 ; match = lastUpdatedRegex.exec(data) ; i++ ) cards[i].lastRequest = Number(new Date(match[1]+' +08:00'))/1000;
        
        cards.forEach((card)=>{
          if( card.gram == minGram ) card.minGram = true;
          bulkUpdateQuery.push(dbUpdateData(card))
        })
        cache.set(cardUrl, cards, 600);
        db.bulkUpdate('cards', bulkUpdateQuery);
        return cards;
      }).catch((err)=>console.log(err));

      str = "Cheap Card Prices - Powered by poring.life\n👍: best gram dust value\n";
      if( cards ){
        cards.forEach((card)=>{
          str += `${card.color}${(card.price).toLocaleString()} - ${card.name}${card.minGram?' 👍':''}\n`
        })
      }
    }
    else{
      console.log('querying data...');
      const data = await db.get('cards', query);
      console.log('query done');

      const cards = {}; // processed card
      data.forEach(card=>{
        cards[card.name] = {
          price: typeof(card.price)=="string" ? parseInt(card.price.replace(/,/g,'')) : card.price,
          lastRequest: card.lastRequest,
          volume: card.volume
        };
      });

      // sort highest price first
      const sortedCard = Object.entries(cards).sort((a,b) => (b[1].price||1E99) - (a[1].price||1E99));

      str = "King Poring Card Reproduction Prices - Powered by poring.life\n❌: Out of Stock\n";
      let totalPrice = 0;
      let totalCount = 0;
      sortedCard.forEach((card)=>{
        if( !card[1].price ) str += 'unknown';
        else{
          str += card[1].price.toLocaleString();
          totalPrice += card[1].price;
          totalCount++;
        }
        if( !card[1].volume ) str += '❌';
        str += ` - ${card[0].replace(/\s*card$/i,"")} - ${Math.round((Date.now()/1000-card[1].lastRequest)/360)/10} hour(s) ago\n`
      });
      str += 'Average Price: ' + Math.round(totalPrice/totalCount).toLocaleString() + '\n';
    }

    let msgs = str.match(/.{1,1988}(\n|$)/gs); // split message every 2000 chars
    for( let i=0 ; i<msgs.length ; i++ ){
      await message.channel.send("```json\n"+msgs[i]+"```").catch((err)=>console.log(err));
    }
  }
};
