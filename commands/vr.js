const fetch = require('node-fetch');
const db = require('./../lib/mongo.js');
const lastReset = require('./../lib/time.js');

const vrUrl = "https://spiriusgaming.com/vr-maps.html"

module.exports = {
	name: 'vr',
  alias: /^vr(\d+)/i,
	description: 'Valhalla Ruins map (SEA)',
	async execute(message, args) {
    message.react('🆗');

    // get bosses
    const bossPromise = db.get('valhalla', {id: (message.guild||{}).id}, {level: 1, created_at: 1})
      .then(res => {
        let str = "";
        let currentLevel = 0;
        res.forEach(data=>{
          if( data && !lastReset.isOutdated(data.created_at) ){              
            if( data.level > currentLevel ){
              str += `\n**${data.level}**\n`
              currentLevel = data.level  
            }
            str += `${data.boss.trim()} \`(${data.actor})\`\n`;
          }         
        })
        return str;
      });
    
    // default meme image
    let image = "https://cdn.glitch.com/48c7ed45-371e-47bc-b3cd-bbf3cb69a60a%2Fimage.png?1557083805225.png";
    const dbImage = await db.get('valhalla_map', {level: 0}).then(res => res[0]) || {};
   
    // if db image is overridden for the week, use it
    if( dbImage.created_at > new Date ){
      image = dbImage.url;
    }
    else{
      const imgUrl = await fetch('https://spiriusgaming.com/vr-maps.html')
        .then(res => res.text()).then(data=>{
          const regex = /img src\s*=\s*"(?!asset)(.*)"/
          const matches = regex.exec(data)
          return 'https://spiriusgaming.com/' + matches[1]
        })
      const webImage = await fetch(imgUrl)
        .then(res => {
          return {
            url: imgUrl,
            created_at: new Date(res.headers.get('Last-Modified')) - 0
          }
        }).catch((e)=>{console.log(e); return {}});
      
      // if external is more updated than database, update it
      if( webImage.url && webImage.created_at > (dbImage.created_at||0) ){
        db.update('valhalla_map', {level: 0}, webImage, {upsert: true});
        // if the image is not outdated, use it
        if( !lastReset.isOutdated(webImage.created_at) ) image = webImage.url;
      }
      // else if database is not outdated, use it
      else if( !lastReset.isOutdated(dbImage.created_at) ) image = dbImage.url;
    }

    const str = (await bossPromise)||'Gunakan `!setvr` untuk set bosnya';
    
    return message.channel.send(str, {files: [image]}).catch((err)=>{
      console.log(err);
      return message.channel.send(str + '\nGagal mengirim gambar, coba cek di ' + vrUrl );
    })
	},
};