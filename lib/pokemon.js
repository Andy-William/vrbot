const fetch = require('node-fetch');
const md5 = require('md5');
const db = require('./mongo.js');

function getBase64Image(url){
  return fetch(url).then(resp=>resp.buffer()).then(image=>image.toString('base64'));
}

function insertPokemon(name, imageUrl){
  return getBase64Image(imageUrl).then(image=>{
    const hashedImg = md5(image);
    console.log(hashedImg);
    return db.update('pokemon', {name: name}, {name: name, image: hashedImg}, {upsert: true}).then(res=>{
      console.log(res.modifiedCount)
      console.log(res.upsertedCount)
      
      return Boolean(res.modifiedCount || res.upsertedCount);
    }).catch(err=>{
      console.log(err);
      return false;
    });
  }).catch(err=>{
    console.log(err);
    return false;
  });
}

function getPokemon(imageUrl){
  return getBase64Image(imageUrl).then(image=>{
    const hashedImg = md5(image);
    console.log(hashedImg);
    return db.get('pokemon', {image: hashedImg}).then(res=>(res[0]||{})).catch(err=>{
      console.log(err);
      return undefined;
    });
  }).catch(err=>{
    console.log(err);
    return undefined;
  });
}

function savePokemon(userId, pokemon){
  const query = {pokemon: pokemon.toLowerCase(), user_id: userId};
  return db.get('saved_pokemon', query).then(res=>{
    if( res.length > 0 ){
      db.delete('saved_pokemon', query)
      return -1; 
    }
    else{
      return db.get('pokemon', {name: pokemon}).then(res=>{
        if( res.length > 0 ){
          db.insert('saved_pokemon', [query]);
          return 1;
        }
        return 0;
      })
    }
  })
}

function savedPokemon(userId){
  return db.get('saved_pokemon', {user_id: userId}).then(res=>{
    return res.map(data=>data.pokemon);
  })
}

function processMessage(message){
  let matches;
  if( message.embeds[0] && message.embeds[0].title ){
    if(message.embeds[0].title.match(/A wild pok/)){
      // console.log(message.embeds[0]);
      // getPokemon(message.embeds[0].image.url).then(mon=>{
      //   console.log(mon);
      //   const name = mon.name;
      //   if( name ){
      //     message.channel.send('Sepertinya namanya ||`'+ name +'`||');
      //     db.get('saved_pokemon', {pokemon: name.toLowerCase()}).then(res=>{
      //       const ids = res.map(data=>data.user_id)
      //       if( ids.length > 0 ){
      //         message.channel.send('<@!'+ ids.join('> <@!') +'>');
      //         for( let i=0 ; i<ids.length ; i++ ){
      //           try{
      //             message.guild.members.get(ids[i]).send("ada " + name);
      //           }catch(err){
      //             console.log(err);
      //           }
      //         }
      //       }
      //     })
      //     if( mon.category ){
      //       message.guild.members.get("273387024856383489").send(".catch " + name);
      //     }
      //   }
      //   else message.channel.send('Namanya siapa ya ini 🤔');
      // })
      message.channel.send('<@&621250779185152001>');
    }
    else if ( matches = message.embeds[0].title.match(/^(?:Base stats for |Level \d+ )([^"]*?)(?: #\d+\.|$| - ID: \d+)/)){
      if( message.embeds[0].author ){
        insertPokemon(matches[1], message.embeds[0].image.url).then(changed=>{
          if( changed ) message.channel.send(matches[1] + ' data updated')
        }).catch(err=>{
          try{
            console.log(err);
            const client = require('./bot.js').client;
            client.channels.get('555311795771015193').send(`error saving: ${matches[1]} - ${message.embeds[0].image.url}`);
          } catch(err){}
        });
      }
    }  
  }
  else if ( matches = message.content.match(/^The wild pokémon is (.*)!/)){
    const regex = new RegExp('^'+matches[1].replace(/\\/g,'').replace(/\./g,'\\.').replace(/_/g,'.')+'$')
    db.get('pokemon', {name: {$regex: regex, $options: 'i'}})
      .then(res=>{
        console.log('awawa')
        console.log(res)
        const names = res.map(r=>r.name)
        if( names.length ){
          message.channel.send(names.join('\n'));
        }
        else{
          message.channel.send('gak kenal... cek info dong kalau sudah ditangkap 😄')
        }
      })
      .catch(err=>{
        console.log(err);
        return [];
      });
  }
}

exports.insert = insertPokemon;
exports.process = processMessage;
exports.saved = savedPokemon;
exports.save = savePokemon