const db = require('./../lib/mongo.js');
const fetch = require('node-fetch');
const cache = require('./../lib/cache.js');

const cardUrl = "https://poring.life/?&server=el&q=gramdust"

const colorMap = {
  'white': '⬜',
  'green': '🟩',
  'blue': '🟦',
  'purple': '🟪'
}
const gramMap = {
  'white': 10,
  'green': 20,
  'blue': 50,
  'purple': 100
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
      let cards = cache.get('gramdust')

      if( !cards ){
        // purchasable card only
        cards = await db.get('cards', {lastRequest: {$exists: true}});
        
        // [zeny per gram, price, color, name]
        cards = cards.map(card=>{
          return {
            gram: (card.price+10000)/gramMap[card.color],
            price: card.price,
            color: colorMap[card.color],
            name: card.name
          }
        }).sort((a, b)=>{return a.gram-b.gram})
        cards = cards.slice(0,20)
        cache.set('gramdust', cards, 600);
      }

      str = "Cheap Card Prices for Gram Dust - Powered by poring.life\n";
      if( cards ){
        cards.forEach((card)=>{
          str += `${card.color}${(card.price).toLocaleString()} - ${card.name}\n`
        })
      }
      str += 'Use \'card <space> color\' to get cards from specific color'
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
