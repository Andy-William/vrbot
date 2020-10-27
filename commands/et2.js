const fetch = require('node-fetch');
const Canvas = require('canvas');
const Discord = require('discord.js');
const fs = require('fs');
const md5 = require('md5');
const assets = require('./../lib/assets.js');
const tabletojson = require('tabletojson').Tabletojson;

const etUrl = 'https://docs.google.com/spreadsheets/d/11AilkJ0Kn66TUOXwjQ2O9iNzk6A_TLLuZk8nTX2Zckk/htmlview'
const creditUrl = 'https://spiriusgaming.com/et-list.html'
const cacheDirectory = './tmp/'

function getBosses(url){
  let res = {}
  return fetch(url).then(res => res.text()).then(data=>{
    const rawtable = data.match(/<table.*<\/table>/)[0];
    const table = tabletojson.convert(rawtable, {forceIndexAsNumber: true})[0];
    res.updated = table[2][Object.keys(table[1]).find(key=>table[1][key].match(/last update/i))||0];
    res.source = creditUrl;

    res.mvp = {};
    res.mini = {};
    for( i=5 ; i<62 ; i++ ){
      for( j=1 ; j<=10 ; j++ ){
        let key = table[i][0]%10 == 0 ? 'mvp' : 'mini';
        res[key][j] || (res[key][j] = {});
        res[key][j][table[i][0]] || (res[key][j][table[i][0]] = []);
        res[key][j][table[i][0]].push(table[i][j]);
      } 
    }
    return res;
  })
}

async function drawImage(data, type, message){
  // check if picture already cached
  const hash = md5(JSON.stringify(data)+type) + '.png';
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
  const entries = Object.entries(data[type]);
  const titleSize = 80;  // tulisan judul yang di atas
  const headerSize = 40;  // ukuran row header
  const channelSize = 75;  // ukuran column paling kiri yang tulisan channel
  const horizontalBuffer = 8;  // jarak dari gambar ke garis batas kolom
  const verticalBuffer = 8;  // jarak dari gambar ke garis batas row
  const imageSize = 45;  // ukuran gambar
  const footerSize = 25; // footer

  const canvas = Canvas.createCanvas(
    channelSize + Object.keys(entries[0][1]).length*horizontalBuffer*2 + Object.values(entries[0][1]).flat().length*imageSize,
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
  
  // iterate bosses in each ch sequentially, draw vertical line
  for( const [floor, boss] of Object.entries(entries[Object.keys(entries)[0]][1]) ){
    ctx.beginPath();
    ctx.moveTo(offset, titleSize);
    ctx.lineTo(offset, canvas.height-footerSize);
    ctx.stroke();
    const columnLength = (boss.length*imageSize)+2*horizontalBuffer;
    ctx.fillText(floor+'F', offset+columnLength/2, titleSize+headerSize/2);
    offset += columnLength;
  }

  for( let i=0 ; i< entries.length ; i++ ){
    const [channel, channelboss] = entries[i];
    // channel name on the left
    ctx.fillText('CH'+channel, channelSize/2, titleSize + headerSize + verticalBuffer + i*(verticalBuffer*2+imageSize) + imageSize/2  )
    // horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, titleSize + headerSize + (i+1)*(verticalBuffer*2+imageSize));
    ctx.lineTo(canvas.width, titleSize + headerSize + (i+1)*(verticalBuffer*2+imageSize));
    ctx.stroke();
    
    let offset = channelSize;
    
    for( const [floor, bosses] of Object.entries(channelboss)){
      offset += horizontalBuffer;
    
      for( let j in bosses ){
        boss = bosses[j]
        ctx.drawImage(
          await assets.getCanvas(boss=='loading'?'question_mark':boss),
          offset,
          titleSize + headerSize + verticalBuffer + i*(verticalBuffer*2+imageSize),
          imageSize,
          imageSize
        );
        offset += imageSize;
      }
      offset += horizontalBuffer;
    }
    // for( let j=0 ; j<floor.length ; j++ ){
    //   sost bosses = floor[j];
    //   offset += horizontalBuffer;
    //   for( let k=0 ; k<bosses.length ; k++ ){
    //     ctx.drawImage(
    //       await assets.getCanvas(bosses[k]=='loading'?'question_mark':bosses[k]),
    //       offset,
    //       titleSize + headerSize + verticalBuffer + i*(verticalBuffer*2+imageSize),
    //       imageSize,
    //       imageSize
    //     );
    //     offset += imageSize;
    //   }
    //   offset += horizontalBuffer;
    // }
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

module.exports = {
	name: 'et2',
	description: 'Endless Tower Boss List (SEA)',
	async execute(message, args) {
    message.react('🆗');
    try{
      bosses = await getBosses(etUrl);
      drawImage(bosses, 'mvp', message).then(([image, updated])=>{
        message.channel.send('Updated ' + updated, new Discord.Attachment(image, 'mvp.png'))
      }).catch((err)=>{
        console.log(err);
        return message.channel.send('Gagal mengirim gambar, coba cek di ' + creditUrl );
      });
      drawImage(bosses, 'mini', message).then(([image, updated])=>{
        message.channel.send('Updated ' + updated, new Discord.Attachment(image, 'mini.png'))
      }).catch((err)=>{
        console.log(err);
        return message.channel.send('Gagal mengirim gambar, coba cek di ' + creditUrl );
      });
    } catch(err){
      console.log(err);
      return message.channel.send('Gagal mengirim gambar, coba cek di ' + creditUrl );
    }
	},
};  