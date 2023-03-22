const fetch = require('node-fetch');
const Canvas = require('canvas');
const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs');
const md5 = require('md5');
const assets = require('../lib/assets.js')
const cache = require('../lib/cache.js');
const mvp = require('../lib/mvp.js');
const db = require('../lib/mongo.js');
const CSV = require('../lib/csv.js');

Canvas.registerFont('./assets/fonts/MochiyPopPOne-Regular.ttf', {family: "Mochiy Pop P One"})

const mvpUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSaCPGUYKYyrbJkLpkYq4KHUxWt8iptJzjLCCZ22wyVGc2yiKv2dXl8TghvDRcfLirTlJ_wL3rXcWCX/pub?gid=1364391805&single=true&output=csv'
const cacheDirectory = './tmp/'

const themes ={
  dark: {
    imgBgColor: '#222222',
    tenBgColor: '#444444',
    altBgColor: '#222222',
    lineColor: '#0091EA',
    fontColor: '#F0F8FF',
    tenFontColor: '#e69199',
  },
  light: {
    imgBgColor: '#FFFFFF',
    tenBgColor: '#FFCCCC',
    altBgColor: '#CCCCCC',
    lineColor: '#444444',
    fontColor: '#000000',
    tenFontColor: '#FF0000',
  }
}

// const mvpLv = [3,6,10,13,16,20,23,26,30,33,36,40,43,46,50,53,56,60,63,66,70,74,77,80,84,87,90,94,97,100]
const mvpLv = [10,20,30,40,50,60,70,80,90,100]
async function getBosses(url){
  const cached = cache.get(url);
  if( cached ) return cached;

  let res = {bosses: {}, updated: "", source: ""};
  console.log('fetching ' + url);
  return await fetch(url).then(res => res.text()).then(data=>{
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

    cache.set(url, res, 5);
    return res;
  }).catch((e)=>{console.log(e); return {}});
}

async function drawImage(data, theme){
  // check if picture already cached
  const hash = md5(JSON.stringify(data)) + `-${theme}.png`;
  try{
    const picture = fs.readFileSync(cacheDirectory + hash);
    return [Buffer.from(picture), data.updated, data.source];
  } catch (e) {
    console.log('redrawing ET');
  };

  // if not, create new picture
  const entries = Object.entries(data.bosses);
  const titleSize = 80;  // tulisan judul yang di atas
  const headerSize = 40;  // ukuran row header
  const channelSize = 75;  // ukuran column paling kiri yang tulisan channel
  const horizontalBuffer = 8;  // jarak dari gambar ke garis batas kolom
  const verticalBuffer = 8;  // jarak dari gambar ke garis batas row
  const imageSize = 45;  // ukuran gambar
  const footerSize = 35; // footer
  const imgBgColor = themes[theme].imgBgColor;
  const tenBgColor = themes[theme].tenBgColor; // 10 floor boss bgcolor
  const altBgColor = themes[theme].altBgColor; // zebra color per row
  const lineWidth = 3;
  const lineColor = themes[theme].lineColor;
  const fontColor = themes[theme].fontColor;
  const tenFontColor = themes[theme].tenFontColor; // 10 floor boss floor font color

  const canvas = Canvas.createCanvas(
    channelSize + entries[0][1].length*horizontalBuffer*2 + entries[0][1].length*imageSize,
    entries.length*(imageSize*3+verticalBuffer*2) + titleSize + headerSize + footerSize
  );
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = imgBgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = 'bold 40px Mochiy Pop P One';
  ctx.fillStyle = fontColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Endless Tower', canvas.width/2, titleSize/2);

  ctx.font = '1px Mochiy Pop P One'
  const maxSize = channelSize / ctx.measureText(data.source).width; // max font size for small A1 cell
  ctx.font = `${maxSize}px Mochiy Pop P One`
  ctx.fillText(data.source, channelSize/2, titleSize + headerSize/2);

  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.moveTo(0, titleSize);
  ctx.lineTo(canvas.width, titleSize);
  ctx.stroke();

  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.moveTo(0, titleSize+headerSize);
  ctx.lineTo(canvas.width, titleSize+headerSize);
  ctx.stroke();

  ctx.font = 'bold 24px calibri'
  let offset = channelSize;
  for( let i=0 ; i<entries[0][1].length ; i++ ){
    ctx.beginPath();
    ctx.moveTo(offset, titleSize);
    ctx.lineTo(offset, canvas.height-footerSize);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.stroke();
    const columnLength = (imageSize)+2*horizontalBuffer;

    if( mvpLv[i]%10==0 ){
      ctx.fillStyle = tenBgColor
      ctx.fillRect(
        offset + lineWidth/2,
        titleSize + lineWidth/2,
        columnLength - lineWidth,
        headerSize - lineWidth
      )
      ctx.fillStyle = tenFontColor;
    }
    else ctx.fillStyle = fontColor;
    ctx.fillText(mvpLv[i]+'F', offset+columnLength/2, titleSize+headerSize/2);
    offset += columnLength;
  }

  for( let i=0 ; i< entries.length ; i++ ){
    const [channel, floor] = entries[i];
    if( i%2==0 ){
      ctx.fillStyle = altBgColor
      ctx.fillRect(
        0,
        titleSize + headerSize + i*(verticalBuffer*2+imageSize*3) + lineWidth/2,
        channelSize - lineWidth/2,
        verticalBuffer*2+imageSize*3 - lineWidth
      )
    }
    ctx.fillStyle = fontColor;
    ctx.fillText('CH'+channel%10, channelSize/2, titleSize + headerSize + verticalBuffer + i*(verticalBuffer*2+imageSize*3) + imageSize*3/2  )

    ctx.beginPath();
    ctx.moveTo(0, titleSize + headerSize + (i+1)*(verticalBuffer*2+imageSize*3));
    ctx.lineTo(canvas.width, titleSize + headerSize + (i+1)*(verticalBuffer*2+imageSize*3));
    ctx.stroke();

    let offset = channelSize;
    for( let j=0 ; j<floor.length ; j++ ){
      if( mvpLv[j]%10==0 ){
        ctx.fillStyle = tenBgColor
        ctx.fillRect(
          offset + lineWidth/2,
          titleSize + headerSize + i*(verticalBuffer*2+imageSize*3) + lineWidth/2,
          imageSize + horizontalBuffer*2 - lineWidth,
          verticalBuffer*2+imageSize*3 - lineWidth
        )
      }
      else if( i%2==0 ){
        ctx.fillStyle = altBgColor
        ctx.fillRect(
          offset + lineWidth/2,
          titleSize + headerSize + i*(verticalBuffer*2+imageSize*3) + lineWidth/2,
          imageSize + horizontalBuffer*2 - lineWidth,
          verticalBuffer*2+imageSize*3 - lineWidth
        )
      }
      const bosses = floor[j];
      offset += horizontalBuffer;
      for( let k=0 ; k<bosses.length ; k++ ){
        let extrabuf = (3-bosses.length)*imageSize/2;
        ctx.drawImage(
          await assets.getCanvas(bosses[k]),
          offset,
          titleSize + headerSize + verticalBuffer + i*(verticalBuffer*2+imageSize*3)+k*imageSize+extrabuf,
          imageSize,
          imageSize
        );
      }
      offset += imageSize + horizontalBuffer;
    }
  }

  ctx.font = '24px Mochiy Pop P One';
  ctx.textBaseline = 'bottom';
  ctx.textAlign = 'left';
  ctx.fillStyle = fontColor;
  ctx.fillText('Updated ' + data.updated, 0, canvas.height);

  ctx.textAlign = 'right';
  ctx.fillText('Source: ' + data.source, canvas.width, canvas.height);

  ctx.font = '70px Mochiy Pop P One';
  ctx.textAlign = 'left';
  ctx.fillStyle = fontColor;
  ctx.globalAlpha = 0.2
  ctx.fillText(data.source, canvas.width/10, canvas.height/2.18);
  ctx.fillText(data.source, canvas.width/10, canvas.height/1.35);

  const buf = canvas.toBuffer();
  fs.writeFile(cacheDirectory + hash, buf, (err)=>{if(err)console.log(err)});

  return [buf, data.updated, data.source];
}

async function getMvp(from, to, theme){
  const data = await getBosses(mvpUrl);
  const floors = Object.keys(data.bosses);
  let values = [];
  for( let i=0 ; i<floors.length ; i++ ){
    const floor = floors[i];
    const bosses = data.bosses[floor];
    let sum = 0;
    for( let j=0 ; j<bosses.length ; j++ ){
      if( mvpLv[j] >= from && mvpLv[j] <= to ){
        for( let k=0 ; k<bosses[j].length ; k++ ){
          sum += await mvp.getValue(bosses[j][k])
        }
      }
    }
    values.push([sum, floor%10]);
  }
  const [image, updated, source] = await drawImage(data, theme);
  return [image, updated, source, values];
}

async function getEtEmbed(from, to, theme){
  const [image, updated, source, values] = await getMvp(from, to, theme)

  const attachment = new AttachmentBuilder(image, {name: 'mvp.png'})
  const embed = new EmbedBuilder()
    .setTitle('ET MVP List')
    .setDescription('Updated ' + updated)
    // .setURL(source)
    .addFields(
      {
        name: 'Suggested Channels from floor ' + from + ' to ' + to + ' (with score)',
        value: values.sort((a,b)=>b[0]-a[0]).map(v=>`${v[1]} - ${Math.round(v[0])}`).join('\n')
      },
    )
    .setImage('attachment://mvp.png')

  return [embed, attachment];
}

module.exports = {
	name: 'et',
  alias: '^ett+$',
	description: 'Endless Tower Boss List (SEA)',
  options: [
    {
      type: ApplicationCommandOptionType.Integer,
      name: 'start',
      description: 'Starting floor for score calculation',
      min: 1,
      max: 100,
      required: false
    }, {
      type: ApplicationCommandOptionType.Integer,
      name: 'end',
      description: 'Ending floor for score calculation',
      min: 1,
      max: 100,
      required: false
    }, {
      type: ApplicationCommandOptionType.String,
      name: 'theme',
      description: 'Color theme (default: dark)',
      choices: [
        {name: 'dark', value: 'dark'},
        {name: 'light', value: 'light'},
      ],
      required: false
    }
  ],

	async processMessage(message, args) {
    message.react('🆗').catch(e=>console.log(e));
    // get et no score
    const dbImage = await db.get('et').then(res => res[0]) || {};
    if( dbImage.created_at > new Date ){
      imageUrl = dbImage.url;
      return await message.channel.send({files: [imageUrl]})
    }

    let range = [1,100]
    if( args ){
      range = [parseInt(args[0])||1, parseInt(args[1]||100)]
    }

    try{
      const [embed, file] = await getEtEmbed(...range, 'dark')
      return message.channel.send({embeds: [embed], files: [file]})
    } catch(err){
      console.log(err);
      return message.channel.send('Failed to send picture');
    }
	},
  async processInteraction(interaction) {
    // get et no score
    const dbImage = await db.get('et').then(res => res[0]) || {};
    if( dbImage.created_at > new Date ){
      imageUrl = dbImage.url;
      return await interaction.reply({files: [imageUrl]})
    }

    await interaction.deferReply();
    const from = interaction.options.getInteger('start')||1;
    const to = interaction.options.getInteger('end')||100;
    const theme = interaction.options.getString('theme')||'dark';

    try{
      const [embed, file] = await getEtEmbed(from, to, theme)
      await interaction.editReply({embeds: [embed], files:[file]})
    } catch(err){
      console.log(err);
      await interaction.editReply('Failed to send picture');
    }
  }
};
