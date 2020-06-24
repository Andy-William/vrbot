const fetch = require('node-fetch');

async function bulkGetPrice(itemNames){
  // split items into chunks of 64
  if( itemNames.length > 64 ){
    let promises = [];
    while( itemNames.length > 0 ) promises.push(bulkGetPrice(itemNames.splice(-64)));
    return (await Promise.all(promises)).flat();
  }
  
  let nameMap = {} // { converted_name: 'Original Name' }
  itemNames.forEach((itemName)=>{
    nameMap[
      itemName.toLowerCase()
      .replace(/[ -]/g, '_')
      .replace(/[.'()]/g, '')
      .replace(/\*/g, 'star')
      .replace(/fiery_mane/, 'fire_pony')
      .replace(/skeleton_miner/, 'skeleton_worker')
      .replace(/silver_knife_of_chastity/, 'silver_knife_of_chasity')
      .replace(/mistress_the_dead/, 'dead_mistress')
      .replace(/phreeoni_the_dead/, 'dead_phreeoni')
      .replace(/little_siroma/, 'snowier')
      .replace(/ice_statue/, 'ice_titan')
    ] = itemName;
  });
  console.log('requesting ' + itemNames);
  const data = await fetch(`https://api.poporing.life/get_latest_prices`, {
      headers: { 'Origin': 'https://poporing.life' },
      method: 'POST',
      body: JSON.stringify(Object.keys(nameMap))
    })
    .then(res => res.json())
    .then(json => json.data)
    .catch(err=>[])
  console.log('request done');
  return data.map((item)=>{
    let detail = item.data;
    return {
      name: nameMap[item.item_name],
      price: (detail.price||detail.last_known_price),
      lastRequest: detail.timestamp,
      volume: detail.volume,
      snapping: detail.snapping
    }
  })
}

exports.bulkGetPrice = bulkGetPrice;