const fetch = require('node-fetch');
const db = require('./../lib/mongo.js');
const lastReset = require('./../lib/time.js');

const oracleUrl = "https://spiriusgaming.com/oracle.html"

module.exports = {
	name: 'oracle',
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
      const imgUrl = await fetch(oracleUrl)
        .then(res => res.text()).then(data=>{
          const regex = /img src\s*=\s*"(?!asset)(.*)"/
          const matches = regex.exec(data)
          return 'https://spiriusgaming.com/' + matches[1]
        })
      const webImage = await fetch(imgUrl)
        .then(res => {
          return {
            url: imgUrl,
            created_at: new Date(res.headers.get('Last-Modified') || new Date()) - 0
          }
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