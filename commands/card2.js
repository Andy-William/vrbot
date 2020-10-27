const fs = require('fs');
const db = require('./../lib/mongo.js');
const poporing = require('./../lib/poporing.js');

module.exports = {
	name: 'card2',
	description: 'King Poring Cards Prices',
	async execute(message, args) {
    args = args.join('')
    let query = {color: {$in: []}};
    if( args.match(/putih|white/i) ) query.color.$in.push('white');
    if( args.match(/hijau|green|ijo/i) ) query.color.$in.push('green');
    if( args.match(/biru|blue/i) ) query.color.$in.push('blue');
    if( args.match(/ungu|purple/i) ) query.color.$in.push('purple');
    if( args.match(/mini/i) ) query.color.$in.push('mini');
    if( args.match(/mvp/i) ) query.color.$in.push('mvp');
    if( args.match(/haute|craft/i) ) query.color.$in.push('haute');

    if( query.color.$in.length == 0 ) return await message.reply('Usage: `card <spasi> white/green/blue/purple/mini/mvp/craft`');
    
    message.react('🆗');
    console.log('querying data...');
    const data = await db.get('cards', query);
    console.log('query done');

    const cards = {}; // processed card
    let updates = []; // list of outdated prices
    const someTimeAgo = Number(new Date())/1000 - 10800; // 3 hours ago

    data.forEach(card=>{
      cards[card.name] = {
        price: card.price,
        lastRequest: card.lastRequest,
        volume: card.volume,
        snapping: card.snapping
      };
      if( !card.lastRequest || card.lastRequest < someTimeAgo ){
        if( card.name.match(/gemini|chef/i) ) updates.push(card.name);
        else updates.push(card.name + ' Card');
      }
    });

    if( updates.length > 0 ){
      const prices = await poporing.bulkGetPrice(updates);

      let bulkUpdateQuery = []
      prices.forEach(p=>{
        const name = p.name.match(/^(.*?)(?: Card)?$/)[1];
        cards[name] = (({name, ...others})=>({...others}))(p); // take all attributes except name
        bulkUpdateQuery.push({
          query: {name: name},
          data: cards[name]
        });
      })
      db.bulkUpdate('cards', bulkUpdateQuery);
    }

    // sort highest price first
    const sortedCard = Object.entries(cards).sort((a,b) => (b[1].price||Infinity) - (a[1].price||Infinity));

    let str = "King Poring Card Reproduction Prices - Powered by poporing.life\n🎲: Snapping | ❌: Out of Stock\n";
    let totalPrice = 0;
    let totalCount = 0;
    sortedCard.forEach((card)=>{
      if( !card[1].price ) str += 'unknown';
      else{
        str += card[1].price.toLocaleString();
        totalPrice += card[1].price;
        totalCount++;
      }
      if( card[1].snapping > -1 ) str += '🎲';
      if( !card[1].volume ) str += '❌';
      str += ` - ${card[0]} - ${Math.round((Date.now()/1000-card[1].lastRequest)/360)/10} hour(s) ago\n`
    });
    str += 'Average Price: ' + Math.round(totalPrice/totalCount).toLocaleString() + '\n';

    let msgs = str.match(/.{1,1988}(\n|$)/gs); // split message every 2000 chars
    for( let i=0 ; i<msgs.length ; i++ ){
      await message.channel.send("```json\n"+msgs[i]+"```").catch((err)=>console.log(err));
    }
	},
};
