const stringSimilarity = require('string-similarity');
const db = require('./mongo.js');
const cache = require('./cache.js');

const typeValue = {
  'material': 1/100000,
  'blueprint': 1/2000000,
  'equipment': 1/400000,
  'special': 0
}

async function getMvpLoot(name, strict=true){
  this.mvpList = this.mvpList || await db.get('bosses').then(res=>res.map(boss=>boss.name))
  const bestMatch = stringSimilarity.findBestMatch(name.replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()).replace(/ Of /g,'of'), this.mvpList).bestMatch;
  if( strict && bestMatch.rating < 0.9 ){
    console.log('no match ',name, bestMatch);
    return {};
  }
  const bossName = bestMatch.target;

  const itemIds = (await db.get('bosses', {name: bossName}))[0].drops;
  const items = await db.get('items', {_id: {$in: itemIds}});
  return {name: bossName, loot: items};
}

async function getMvpValue(name){
  this.mvpList = this.mvpList || await db.get('bosses').then(res=>res.map(boss=>boss.name))

  const bestMatch = stringSimilarity.findBestMatch(name.replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()).replace(/ Of /g,'of'), this.mvpList).bestMatch;
  if( bestMatch.rating < 0.9 ){
    console.log('no match ',name, bestMatch);
    return 0;
  }
  const bossName = bestMatch.target;
  const cached = cache.get('value-'+bossName)
  if( cached ) return new Promise((resolve, reject)=>resolve(cached));

  const itemIds = (await db.get('bosses', {name: bossName}))[0].drops;
  const items = await db.get('items', {_id: {$in: itemIds}});
  const value = items.reduce((sum, item)=>{
    return sum + (item.price||0) * typeValue[item.type]
  },0)
  cache.set('value-'+bossName, value, 3600)
  return value;
}

async function getMvpRank(){
  const bosses = await db.get('bosses');
  let values = []
  for( i=0 ; i<bosses.length ; i++ ){
    let value = cache.get('value-'+bosses[i].name);
    if( !value ){
      await updateAll();
      value = cache.get('value-'+bosses[i].name);
    }
    values.push([value, bosses[i].name]);
  }
  return values.sort((a,b)=>b[0]-a[0]);
}

async function updateAll(){
  const bosses = await db.get('bosses');
  const itemIds = bosses.map(b=>b.drops).flat();
  const items = await db.get('items', {_id: {$in: itemIds}});
  let itemValues = {}
  items.forEach(item=> itemValues[item._id] = item.price * typeValue[item.type]);
  for( let i=0 ; i<bosses.length ; i++ ){
    const value = bosses[i].drops.reduce((sum, itemId)=>{
      return sum + itemValues[itemId];
    }, 0)
    cache.set('value-'+bosses[i].name, value,3600)
  }
  return true;
}

exports.getValue = getMvpValue
exports.getLoot = getMvpLoot
exports.getRanking = getMvpRank
exports.updateAll = updateAll
