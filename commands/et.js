const fetch = require('node-fetch');
const Canvas = require('canvas');
const Discord = require('discord.js');
const fs = require('fs');
const md5 = require('md5');
const assets = require('./../lib/assets.js')

const mvpUrl = 'https://www.hdgames.net/boss.php'
const miniUrl = 'https://www.hdgames.net/mini.php'
const cacheDirectory = './tmp/'

function getBosses(url){
  let res = {}
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
          floorBoss.push(boss[1].toLowerCase());
        }
        res.bosses[channelId].push(floorBoss)
      })
    }
    return res;
  })
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
    ctx.fillText((type=='mvp'?10+i*10:i%2*3+3+(i>>1)*10)+'F', offset+columnLength/2, titleSize+headerSize/2);
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
    return drawImage(data, 'mvp', message);
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
    getMvp(message).then(([image, updated])=>{
      message.channel.send('Updated ' + updated, new Discord.Attachment(image, 'mvp.png'))
    }).catch((err)=>{
      console.log(err);
      return message.channel.send('Gagal mengirim gambar, coba cek di ' + mvpUrl );
    });
    getMini(message).then(([image, updated])=>{
      message.channel.send('Updated ' + updated, new Discord.Attachment(image, 'mini.png'))
    }).catch((err)=>{
      console.log(err);
      return message.channel.send('Gagal mengirim gambar, coba cek di ' + miniUrl );
    });

//     const str = (await bossPromise)||'Gunakan `!setvr` untuk set bosnya';
//     return message.channel.send(str, {files: [image]}).catch((err)=>{
//       return message.channel.send(str + '\nGagal mengirim gambar, coba cek di ' + vrUrl[level] );
//     })
	},
};  