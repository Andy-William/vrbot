const fetch = require('node-fetch');
const Canvas = require('canvas');
const Discord = require('discord.js');
const fs = require('fs');
const md5 = require('md5');
const stringSimilarity = require('string-similarity');
const assets = require('./../lib/assets.js')
const cache = require('./../lib/cache.js');

const mvpUrl = 'https://www.hdgames.net/boss.php'
const miniUrl = 'https://www.hdgames.net/mini.php'
const cacheDirectory = './tmp/'

const bossValue = {
    'Angeling': 1,
    'Golden Thief Bug': 10,
    'Miss Tahnee': 3,
    'Deviling': 3,
    'Drake': 2,
    'Strouf': 2,
    'Goblin Leader': 8,
    'Mistress': 20,
    'Maya': 1,
    'Phreeoni': 16,
    'Eddga': 2,
    'Osiris': 1,
    'Moonlight Flower': 1,
    'Orc Hero': 1,
    'Kobold Leader': 1,
    'Doppelganger': 18,
    'Atroce': 1,
    'Orc Lord': 8,
    'Detarderous': 1,
    'Owl Baron': 5,
    'Bloody Knight': 1,
    'Baphomet': 1,
    'Dark Lord': 4,
    'Time Holder': 3,
    'Spashire': 11,
    'Stormy Knight': 1,
    'Garm': 10,
    'Kaho': 9,
    'Arc Angeling': 3,
    'Wolf Grandma': 6,
    'Bloody Murderer': 6,
    'Lord of Death': 3,
    'Eremes': 20,
    'Katerina': 1,
    'Devine': 1,
    'Ktullanux': 8,
    'Hill Wind': 1,
    'Gloom Under Night': 1,
    'Snake Gorgons': 3,
    'Wasteland Lord': 1,
    'Poi Tata': 1,
};
const bossKeys = Object.keys(bossValue);

const miniLv = [83,86,88,89,92,93,95,96,98,99]
function getBosses(url){
  const cached = cache.get(url)
  if( cached ) return new Promise((resolve, reject)=>resolve(cached));

  let res = {}
  console.log('fetching ' + url)
  return fetch(url).then(res => res.text()).then(data=>{
    res.bosses = {};
    res.updated = (data.match(/class="cooking">.*?(\d+.*?)</)||[])[1];
    res.source = url;
    const rowRegex = /(CH|EN|PH|TH|ID) *(\d+)[\s<"'].*?<\/td>\s+<(.*?)<\/tr>/gs;
    let channelData;
    while( channelData = rowRegex.exec(data) ){
      const channelId = channelData[1] + channelData[2];
      res.bosses[channelId] = [];
      const channelBosses = channelData[3].split('<td');
      channelBosses.forEach(floorData=>{
        const cellRegex = /src="[^"]*\/(.*?)\.png/gs;
        let boss, floorBoss = [];
        while( boss = cellRegex.exec(floorData) ){
          if( boss[1] == 'hatii' ) boss[1] = 'garm'; // pepega
          if( boss[1] == 'piper' ) boss[1] = 'flute_player'; // pepega
          if( boss[1] == 'gazeti' ) boss[1] = 'ice_statue'; // pepega
          if( boss[1] == 'golden_bug' ) boss[1] = 'golden_thief_bug';
          if( boss[1] == 'lady_tanee' ) boss[1] = 'miss_tahnee';
          if( boss[1] == 'goblin_king' ) boss[1] = 'goblin_leader';
          if( boss[1] == 'moonlight' ) boss[1] = 'moonlight_flower';
          if( boss[1] == 'detale' ) boss[1] = 'detarderous';
          if( boss[1] == 'cecil_damon' ) boss[1] = 'devine';
          if( boss[1] == 'boitata' ) boss[1] = 'poi_tata';
          if( boss[1] == 'kathryne_keyron' ) boss[1] = 'katerina';
          if( boss[1] == 'firelord_kaho' ) boss[1] = 'kaho';
          if( boss[1] == 'hill_wind_captain' ) boss[1] = 'hill_wind';
          if( boss[1] == 'eremes_guile' ) boss[1] = 'eremes';
          if( boss[1] == 'serpent_demon_gorgon' ) boss[1] = 'snake_gorgons';
          if( boss[1] == 'lord-of-the-dead' ) boss[1] = 'lord_of_death';
          floorBoss.push(boss[1].toLowerCase());
        }
        res.bosses[channelId].push(floorBoss)
      })
    }
    cache.set(url, res, 300);
    return res;
  }).catch((e)=>{console.log(e); return {}});
}

async function drawImage(data, type, message){
  // check if picture already cached
  const hash = md5(JSON.stringify(data)) + '.png';
  try{
    if( message.content.match(/--nocache/i) ) throw 'no cache'
    const picture = fs.readFileSync(cacheDirectory + hash);
    return [Buffer.from(picture), data.updated];
  } catch (e) {
    console.log('redrawing ' + type);
    if( type == 'mvp' ) message.react('🎨');
    else message.react('🖌');
  };
  
  // if not, create new picture
  const entries = Object.entries(data.bosses);
  const titleSize = 80;  // tulisan judul yang di atas
  const headerSize = 40;  // ukuran row header
  const channelSize = 75;  // ukuran column paling kiri yang tulisan channel
  const horizontalBuffer = 8;  // jarak dari gambar ke garis batas kolom
  const verticalBuffer = 8;  // jarak dari gambar ke garis batas row
  const imageSize = 45;  // ukuran gambar
  const footerSize = 25; // footer

  const canvas = Canvas.createCanvas(
    channelSize + entries[0][1].length*horizontalBuffer*2 + entries[0][1].flat().length*imageSize,
    entries.length*(imageSize+verticalBuffer*2) + titleSize + headerSize + footerSize
  );
  const ctx = canvas.getContext('2d');

  ctx.font = 'bold 40px calibri';
  ctx.fillStyle = '#F0F8FF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Endless Tower', canvas.width/2, titleSize/2);

  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#0091EA';
  ctx.moveTo(0, titleSize+headerSize);
  ctx.lineTo(canvas.width, titleSize+headerSize);
  ctx.stroke();

  ctx.font = 'bold 24px calibri'
  let offset = channelSize;
  for( let i=0 ; i<entries[0][1].length ; i++ ){
    ctx.beginPath();
    ctx.moveTo(offset, titleSize);
    ctx.lineTo(offset, canvas.height-footerSize);
    ctx.stroke();
    const columnLength = (entries[0][1][i].length*imageSize)+2*horizontalBuffer;
    ctx.fillText((type=='mvp'?Math.floor((i+1)*3+(i+1)/3):miniLv[i])+'F', offset+columnLength/2, titleSize+headerSize/2);
    offset += columnLength;
  }

  for( let i=0 ; i< entries.length ; i++ ){
    const [channel, floor] = entries[i];
    ctx.fillText(channel, channelSize/2, titleSize + headerSize + verticalBuffer + i*(verticalBuffer*2+imageSize) + imageSize/2  )
    
    ctx.beginPath();
    ctx.moveTo(0, titleSize + headerSize + (i+1)*(verticalBuffer*2+imageSize));
    ctx.lineTo(canvas.width, titleSize + headerSize + (i+1)*(verticalBuffer*2+imageSize));
    ctx.stroke();
    
    let offset = channelSize;
    for( let j=0 ; j<floor.length ; j++ ){
      const bosses = floor[j];
      offset += horizontalBuffer;
      for( let k=0 ; k<bosses.length ; k++ ){
        ctx.drawImage(
          await assets.getCanvas(bosses[k]=='loading'?'question_mark':bosses[k]),
          offset,
          titleSize + headerSize + verticalBuffer + i*(verticalBuffer*2+imageSize),
          imageSize,
          imageSize
        );
        offset += imageSize;
      }
      offset += horizontalBuffer;
    }
  }
  
  ctx.font = '16px roboto';
  ctx.textBaseline = 'bottom';
  ctx.textAlign = 'left';
  ctx.fillText('Updated ' + data.updated, 0, canvas.height);
  
  ctx.textAlign = 'right';
  ctx.fillText('Source: ' + data.source, canvas.width, canvas.height);

  const buf = canvas.toBuffer();
  fs.writeFile(cacheDirectory + hash, buf, (err)=>{if(err)console.log(err)});
  return [buf, data.updated];
}

function getMvp(message){
  return getBosses(mvpUrl).then(data=>{
    const values = Object.keys(data.bosses).map(ch=>{
      return [data.bosses[ch].flat().reduce((sum, current)=>{
        const bestMatch = stringSimilarity.findBestMatch(current.replace(/[-_]/g,' '), bossKeys).bestMatch;
        if( bestMatch.rating < 0.5 ){
          console.log(current)
          console.log(bestMatch)
          return sum+0;
        }
        else return sum+bossValue[bestMatch.target];
      },0), ch]
    })
    return drawImage(data, 'mvp', message).then((res)=>[...res, values]);
  })
}

function getMini(message){
  return getBosses(miniUrl).then(data=>{
    return drawImage(data, 'mini', message);
  })
}

module.exports = {
	name: 'et',
  alias: '^ett+$',
	description: 'Endless Tower Boss List (SEA)',
	async execute(message, args) {
    message.react('🆗');
    getMvp(message).then(([image, updated, values])=>{
      console.log(updated,values)
      const embed = new Discord.MessageEmbed()
        .setTitle('ET MVP List')
        .setDescription('Updated ' + updated)
        .setURL(mvpUrl)
        .addFields(
          { name: 'Suggested Channels (best to worst)', value: values.sort((a,b)=>b[0]-a[0]).map(v=>v[1]).join('\n') },
        )
        .attachFiles([new Discord.MessageAttachment(image, 'mvp.png')])
        .setImage('attachment://mvp.png')
      message.channel.send(embed)
    }).catch((err)=>{
      console.log(err);
      return message.channel.send('Gagal mengirim gambar, coba cek di ' + mvpUrl );
    });
    
    // getMini(message).then(([image, updated])=>{
    //   const embed = new Discord.MessageEmbed()
    //     .setTitle('ET Mini List')
    //     .setDescription('Updated ' + updated)
    //     .setURL(miniUrl)
    //     .attachFiles([new Discord.MessageAttachment(image, 'mini.png')])
    //     .setImage('attachment://mini.png')
    //   message.channel.send(embed)
    // }).catch((err)=>{
    //   console.log(err);
    //   return message.channel.send('Gagal mengirim gambar, coba cek di ' + miniUrl );
    // });
	},
};  