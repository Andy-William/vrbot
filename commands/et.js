const fetch = require('node-fetch');
const Canvas = require('canvas');
const Discord = require('discord.js');
const fs = require('fs');
const md5 = require('md5');
const assets = require('./../lib/assets.js')
const cache = require('./../lib/cache.js');
const mvp = require('./../lib/mvp.js');
const db = require('./../lib/mongo.js');
const CSV = require('./../lib/csv.js');

Canvas.registerFont('./assets/fonts/MochiyPopPOne-Regular.ttf', {family: "Mochiy Pop P One"})

const mvpUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSaCPGUYKYyrbJkLpkYq4KHUxWt8iptJzjLCCZ22wyVGc2yiKv2dXl8TghvDRcfLirTlJ_wL3rXcWCX/pub?gid=1364391805&single=true&output=csv'
const cacheDirectory = './tmp/'

const mvpLv = [3,6,10,13,16,20,23,26,30,33,36,40,43,46,50,53,56,60,63,66,70,74,77,80,84,87,90,94,97,100]
function getBosses(url){
  const cached = cache.get(url)
  if( cached ) return new Promise((resolve, reject)=>resolve(cached));

  let res = {bosses: {}, updated: "", source: ""}
  console.log('fetching ' + url)
  return fetch(url).then(res => res.text()).then(data=>{
    let table = CSV.CSVToArray(data);

    let bosses = {};
    for( let i=1 ; i<=30 ; i+=3 ){
      const floor = table[i][0];
      bosses[floor] = [];
      for( let j=0 ; j<mvpLv.length ; j++ ){
        bosses[floor][j] = [];
        for( let k=0 ; k<3 ; k++ ){
          const boss = table[i+k][j+1];
          if( boss ) bosses[floor][j].push(boss);
        }
      }
    }
    res.bosses = bosses;
    res.updated = table[31][1];
    res.source = table[31][2];

    cache.set(url, res, 60);
    return res;
  }).catch((e)=>{console.log(e); return {}});
}

async function drawImage(data, type, message){
  // check if picture already cached
  const hash = md5(JSON.stringify(data)) + '.png';
  try{
    if( message.content.match(/--nocache/i) ) throw 'no cache'
    const picture = fs.readFileSync(cacheDirectory + hash);
    return [Buffer.from(picture), data.updated, data.source];
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

  ctx.font = 'bold 40px Mochiy Pop P One';
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
    ctx.fillText(mvpLv[i]+'F', offset+columnLength/2, titleSize+headerSize/2);
    offset += columnLength;
  }

  for( let i=0 ; i< entries.length ; i++ ){
    const [channel, floor] = entries[i];
    ctx.fillText('CH'+channel%10, channelSize/2, titleSize + headerSize + verticalBuffer + i*(verticalBuffer*2+imageSize) + imageSize/2  )
    
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
          await assets.getCanvas(bosses[k]),
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
  
  ctx.font = '14px Mochiy Pop P One';
  ctx.textBaseline = 'bottom';
  ctx.textAlign = 'left';
  ctx.fillText('Updated ' + data.updated, 0, canvas.height);
  
  ctx.textAlign = 'right';
  ctx.fillText('Source: ' + data.source, canvas.width, canvas.height);

  const buf = canvas.toBuffer();
  fs.writeFile(cacheDirectory + hash, buf, (err)=>{if(err)console.log(err)});

  return [buf, data.updated, data.source];
}

async function getMvp(message, range){
  const data = await getBosses(mvpUrl);
  const floors = Object.keys(data.bosses);
  let values = [];
  for( let i=0 ; i<floors.length ; i++ ){
    const floor = floors[i];
    const bosses = data.bosses[floor];
    let sum = 0;
    for( let j=0 ; j<bosses.length ; j++ ){
      if( mvpLv[j] >= range[0] && mvpLv[j] <= range[1] ){
        for( let k=0 ; k<bosses[j].length ; k++ ){
          sum += await mvp.getValue(bosses[j][k])
        }
      }
    }
    values.push([sum, floor%10]);
  }
  return drawImage(data, 'mvp', message).then((res)=>[...res, values]);
}

module.exports = {
	name: 'et',
  alias: '^ett+$',
	description: 'Endless Tower Boss List (SEA)',
	async execute(message, args) {
    message.react('🆗').catch(e=>console.log(e));
    const dbImage = await db.get('et').then(res => res[0]) || {};
    if( dbImage.created_at > new Date ){
      image = dbImage.url;
      return message.channel.send({files: [image]})
    }

    let range = [1,100]
    if( args ){
      range = [parseInt(args[0])||1, parseInt(args[1]||100)]
    }
    getMvp(message, range).then(([image, updated, source, values])=>{
      const embed = new Discord.MessageEmbed()
        .setTitle('ET MVP List')
        .setDescription('Updated ' + updated)
        // .setURL(source)
        .addFields(
          { 
            name: 'Suggested Channels from floor ' + range[0] + ' to ' + range[1] + ' (with score)',
            value: values.sort((a,b)=>b[0]-a[0]).map(v=>`${v[1]} - ${Math.round(v[0])}`).join('\n')
          },
        )
        .attachFiles([new Discord.MessageAttachment(image, 'mvp.png')])
        .setImage('attachment://mvp.png')
      message.channel.send(embed)
    }).catch((err)=>{
      console.log(err);
      return message.channel.send('Failed to send picture');
    });
	},
};  