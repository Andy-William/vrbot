const db = require('../lib/mongo.js');
const cache = require('../lib/cache.js');
const { ApplicationCommandOptionType } = require('discord.js');

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

async function getCards(colors){
  let str = '';

  let query = {color: {$in: []}};
  if( colors.match(/putih|white/i) ) query.color.$in.push('white');
  if( colors.match(/hijau|green|ijo/i) ) query.color.$in.push('green');
  if( colors.match(/biru|blue/i) ) query.color.$in.push('blue');
  if( colors.match(/ungu|purple/i) ) query.color.$in.push('purple');
  if( colors.match(/mini/i) ) query.color.$in.push('mini');
  if( colors.match(/mvp/i) ) query.color.$in.push('mvp');
  if( colors.match(/haute|craft/i) ) query.color.$in.push('haute');

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
    str += 'Use \'card <space> color\' to get cards from specific color\nAvailable colors: white, green, blue, purple, mini, mvp, craft'
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

  return str;
}

module.exports = {
  name: 'card',
  alias: '^cards$',
  description: 'King Poring Cards Prices',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'color',
      description: 'white, green, blue, purple, mini, mvp, craft (leave blank for gram dust). Separate with space',
      // choices: [
      //   {name: 'white', value: 'white'},
      //   {name: 'green', value: 'green'},
      //   {name: 'blue', value: 'blue'},
      //   {name: 'purple', value: 'purple'},
      //   {name: 'mini', value: 'mini'},
      //   {name: 'mvp', value: 'mvp'},
      //   {name: 'craft', value: 'haute'},
      //   {name: 'all', value: 'all'}
      // ],
      required: false
    }
  ],
  async processMessage(message, args){
    message.react('🆗');
    let colors = args.join('');

    let str = await getCards(colors);

    let msgs = str.match(/.{1,1988}(\n|$)/gs); // split message every 2000 chars
    for( let i=0 ; i<msgs.length ; i++ ){
      await message.channel.send("```json\n"+msgs[i]+"```")
    }
  },
  async processInteraction(interaction){
    let colors = interaction.options.getString('color')||'';
    let str = await getCards(colors);

    let msgs = str.match(/.{1,1988}(\n|$)/gs); // split message every 2000 chars
    for( let i=0 ; i<msgs.length ; i++ ){
      if( i==0 ) await interaction.reply("```json\n"+msgs[i]+"```");
      else await interaction.followUp("```json\n"+msgs[i]+"```");
    }
  }
};
