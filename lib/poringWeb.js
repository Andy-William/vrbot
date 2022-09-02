const fetch = require('node-fetch');

const url = "https://poring.life/?&server=el&item="

async function getPrice(itemName){
  const items = await fetch(
    url+encodeURI(itemName),
    {headers: {'cookie': "default_server=el"}}
  ).then(res => res.text()).then(data=>{
    const nameRegex = /x.com\/i[^<]*<h6>([^<]*)/g;
    const priceRegex = /Price<.*?<span>([^<]*)/gs;
    const volumeRegex = /Quantity<.*?<span>([^<]*)/gs;
    const lastUpdatedRegex = /Last checked([^<]*)/g;

    let items = [];
    let match;
    while( match = nameRegex.exec(data) ) items.push({name: match[1]});
    for( let i=0 ; match = priceRegex.exec(data) ; i++ ) items[i].price = parseInt(match[1].replace(/,/g,''));
    for( let i=0 ; match = volumeRegex.exec(data) ; i++ ) items[i].volume = match[1];
    for( let i=0 ; match = lastUpdatedRegex.exec(data) ; i++ ) items[i].lastRequest = Number(new Date(match[1]+' +07:00'))/1000;

    return items;
  }).catch((err)=>console.log(err));
  return items;
};

exports.getPrice = getPrice
