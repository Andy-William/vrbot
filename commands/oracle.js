const fetch = require('node-fetch');
const db = require('./../lib/mongo.js');
const lastReset = require('./../lib/time.js');
const cache = require('./../lib/cache.js');

const oracleUrl = "https://spiriusgaming.com/oracle.html"

module.exports = {
	name: 'oracle',
  alias: 'ora$',
	description: 'Oracle dungeon bosses (SEA)',
	async execute(message, args) {
    message.react('🆗');
    
    // default meme image
    let image = "https://cdn.glitch.com/48c7ed45-371e-47bc-b3cd-bbf3cb69a60a%2Fmeme.jpg?v=1592794981131";
    const dbImage = await db.get('oracle').then(res => res[0]) || {};
   
    // if db image is overridden for the week, use it
    if( dbImage.created_at > new Date ){
      image = dbImage.url;
    }
    else{
      const imgUrl = cache.get(oracleUrl) || await fetch(oracleUrl)
        .then(res => res.text()).then(data=>{
          const regex = /img src\s*=\s*"(?!asset)(.*)"/;
          const matches = regex.exec(data);
          const url = 'https://spiriusgaming.com/' + matches[1];
          cache.set(oracleUrl, url, 600);
          return url;
        }).catch((e)=>{console.log(e); return {}});
      const webImage = cache.get(imgUrl) || await fetch(imgUrl)
        .then(res => {
          const img = {
            url: imgUrl,
            created_at: new Date(res.headers.get('Last-Modified') || new Date()) - 0
          }
          cache.set(imgUrl, img, 600);
          return img;
        }).catch((e)=>{console.log(e); return {}});
      
      
      // if external is more updated than database, update it
      if( webImage.url && webImage.created_at > (dbImage.created_at||0) ){
        db.update('oracle', {}, webImage, {upsert: true});
        // if the image is not outdated, use it
        if( !lastReset.isOutdated(webImage.created_at) ) image = webImage.url;
      }
      // else if database is not outdated, use it
      else if( !lastReset.isOutdated(dbImage.created_at) ) image = dbImage.url;
    }

    return message.channel.send({files: [image]}).catch((err)=>{
      return message.channel.send('Gagal mengirim gambar, coba cek di ' + oracleUrl );
    })
	},
};