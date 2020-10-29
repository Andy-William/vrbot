const fs = require('fs');
const db = require('./../lib/mongo.js');
const fetch = require('node-fetch');
const cache = require('./../lib/cache.js');

const cardUrl = "https://market.xkromui.com/?q=cards"

const colorMap = {
  '#727272': '⬜',
  '#66BB6A': '🟩',
  '#90': '🟦',
  '#BD93F9': '🟪'
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
      let cards = [];
      let match;

      while( match = colorRegex.exec(data) ) cards.push({color: colorMap[match[1]]});
      for( let i=0 ; match = nameRegex.exec(data) ; i++ ) cards[i].name = match[1];
      for( let i=0 ; match = priceRegex.exec(data) ; i++ ) cards[i].price = match[1];
      cache.set(cardUrl, cards, 600);
      return cards;
    }).catch((err)=>console.log(err));

    let str = "Cheap Card Prices - Powered by xkromui\n";
    cards.forEach((card)=>{
      str += `${card.color}${card.price} - ${card.name}\n`
    })

    let msgs = str.match(/.{1,1988}(\n|$)/gs); // split message every 2000 chars
    for( let i=0 ; i<msgs.length ; i++ ){
      await message.channel.send("```json\n"+msgs[i]+"```").catch((err)=>console.log(err));
    }
  }
};
