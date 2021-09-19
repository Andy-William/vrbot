const fetch = require('node-fetch');

const url = "https://api.poring.life/v1/search/"

function format(data){
    return {
      id: data.id,
      name: data.name,
      price: data.price,
      lastRequest: data.updated_at,
      volume: data.qty == -1 ? 0 : data.qty,
      category: data.category
    }
}

async function getPrices(itemNames){
  const items = await fetch(
    url+encodeURI(itemNames)
  ).then(res => res.json()).then(data=>{
    return data.data.map(d=>format(d));
  }).catch((err)=>{
    console.log(err);
    return [];
  });
  return items;
};

exports.getPrice = getPrices
