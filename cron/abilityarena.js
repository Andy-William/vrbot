const db = require('../lib/mongo.js');
const client = require('../lib/bot.js').client;
const fetch = require('node-fetch');

const urlPrefix = "https://abilityarena.com/api/players/"
const lastGamePath = "/games?limit=1"
const gameUrlPrefix = "https://abilityarena.com/games/"

let running = false

const IDS = { // steamid : discordid
  "76561198454420816": "466981042025136158",
  "76561198105122586": "187616511886753792",
  "76561198816230071": "231464756639170563",
  "76561198104113985": "169080799079956481",
  "76561198066440332": "295550832697671680",
  "76561198061338187": "259593015918723073",
  "76561198117125034": "209287771615920128",
  "76561198073299252": "273387024856383489",
  "76561198133663989": "344110623451512832",
  "76561198257287686": "436897777805426688",
}

const OrdSuffix = ["th", "st", "nd", "rd", "th", "th", "th", "th", "th"]

async function getLastMatch(steamID){
  return await fetch(
    urlPrefix+steamID+lastGamePath
  ).then(res => res.json()).then(data=>{
    return {
      id: data[0].game_id,
      place: data[0].place,
      god: data[0].god
    };
  }).catch((err)=>{
    console.log(err);
    return {};
  });
}

async function getRank(steamID){
  return await fetch(
    urlPrefix+steamID
  ).then(res => res.json()).then(data=>{
    let medal = data.badge + (data.pips>0?" "+data.pips:"")
    return {
      medal: medal,
      rank: data.rank
    };
  }).catch((err)=>{
    console.log(err);
    return {};
  });
}

// process list of steamids 1 by 1
async function process(steamIDs){
  if( steamIDs.length == 0 ){
    console.log("done updating ability arena")
    running = false;
    return;
  }
  let id = steamIDs.shift();

  const lastMatch = await getLastMatch(id);
  let saved;
  try{
    saved = (await db.get("ability_arena", {steamID: id}))[0] || {};
  } catch {
    // if database failed, just skip
    process(steamIDs)
  }

  // new match is found
  if( lastMatch.id && lastMatch.id != saved.lastMatchId ){
    saved.lastMatchId = lastMatch.id;
    let message = `<@${IDS[id]}> finished ${lastMatch.place}${OrdSuffix[lastMatch.place]} with ${lastMatch.god}`
    let newRank = await getRank(id);

    if( newRank.medal ){
      // rank change
      if( saved.medal != newRank.medal ){
        message += `\nRank changed from ${saved.medal} to ${newRank.medal}${newRank.medal=="Immortal"?" "+newRank.rank:""}`
      }
      else if ( saved.medal == "Immortal" && saved.rank != newRank.rank ){
        message += `\nImmortal rank changed from ${saved.rank} to ${newRank.rank}`
      }
      saved.medal = newRank.medal
      saved.rank = newRank.rank
    }

    await db.update("ability_arena", {steamID: id}, saved, {upsert: true})

    client.channels.cache.get("1027116356899983400").send(message).catch(err=>{
      console.log(err);
    })
  }

  setTimeout(()=>{process(steamIDs)}, 2000)
}

module.exports = {
	name: 'ability arena fetcher',
	schedule: '*/5 * * * *',
	async action() {
    if( running ){
      console.log("skipping ability arena (already running)")
    }
    else{
      running = true
      console.log("updating ability arena");
      await process(Object.keys(IDS))
    }
  },
};
