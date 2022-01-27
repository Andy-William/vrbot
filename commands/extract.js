const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const Discord = require('discord.js');

const odds = {
  1: [200],
  2: [125, 75],
  3: [100, 60, 40],
  4: [75, 55, 45, 25],
  5: [50, 60, 50, 25, 15],
  6: [35, 50, 55, 35, 15, 10],
  7: [20, 40, 45, 45, 30, 12, 8],
  8: [10, 25, 40, 45, 40, 24, 12, 4],
  9: [0, 10, 25, 45, 60, 32, 20, 6, 2],
  10: [0, 0, 20, 30, 60, 50, 25, 10, 4, 1],
  11: [0, 0, 10, 20, 50, 64, 34, 13, 6, 2, 1],
  12: [0, 0, 0, 20, 40, 68, 42, 16, 8, 3, 2, 1],
  13: [0, 0, 0, 10, 30, 64, 54, 20, 12, 4, 3, 2, 1],
  14: [0, 0, 0, 0, 24, 56, 60, 28, 16, 6, 4, 3, 2, 1],
  15: [0, 0, 0, 0, 10, 40, 70, 35, 20, 10, 5, 4, 3, 2, 1]
}

const costs = [60, 60, 60, 60, 60, 60, 65, 70, 75, 80, 90, 110, 125, 140, 160, 200]

function randomOnce(level){
  const odd = odds[level];
  let random = Math.random() * 200;
  let result;

  for(const [index, current] of odd.entries()){
    if( random < current ){
      result = index+1;
      break;
    }
    random -= current;
  }
  return result
}

module.exports = {
	name: 'extract',
  alias: '^re$',
	description: 'Oracle Mirror Extraction Simulator',
	async execute(message, args) {
    if( !args[0] ) return message.reply('Usage: `extract <space> level`');
    const level = parseInt(args[0]);

    if( !(level >= 1 && level <= 15) ) return message.reply('Invalid level. Should be from 1-15');

    if( message.content.match(/^.re/i) ){
      let result = randomOnce(level);
      let str = `<:ExtractLightCrystal:771330344443838474> ${message.author.toString()} got **+${result}**/+${level}${result==level?', gratz!':''} <:ExtractLightCrystal:771330344443838474>\n`;
      return await message.channel.send(str).catch((err)=>console.log(err));
    }

    let current = 0;
    let rolls = 0;

    let dataPoint = [0]
    let dataColor = ["white"]

    while( current < level ){
      let next = randomOnce(level);
      if( next > current ){
        current = next;
        dataColor.push("lime");
      }
      else dataColor.push("white");
      dataPoint.push(current)
      rolls+=1;
    }

    console.log('simul done')

    let width = 35 + dataPoint.length*5
    if( width > 1024 ) width = 1024
    const height = 300;
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
    const gridColor = new Array(16).fill('rgba(255,255,255,0.2)')
    gridColor[level] = 'cyan'

    const configuration = {
      type: 'line',
      data: {
          labels: dataPoint.map(()=>""),
          datasets: [{
            fill: false,
            lineTension: 0,
            borderColor: "rgba(50,200,50,0.5)",
            data: dataPoint,
            pointBackgroundColor: dataColor
          }]
      },
      options: {
        plugins: {
          legend: {display: false}
        },
        showLine: true,
        scales: {
          y: {
            min:0,
            max:15,
            ticks: {
              stepSize: 1,
              font: {  size:12, weight:'bold'}
            },
            position: 'left',
            grid:{
              color: gridColor
            }
          },
          x:{
            grid: {display: false}
          }
        }
      }
    };
    const image = await chartJSNodeCanvas.renderToBuffer(configuration);
    console.log('drawing done')

    const embed = new Discord.MessageEmbed()
      .setTitle(`Oracle Mirror simulator +${level}`)
      .setDescription(`Completed after **${rolls}x** rolls!`)
      .addFields(
        {
          name: 'Initial Cost',
          value: `${costs[level]} <:ExtractLightCrystal:771330344443838474>`,
          inline: true
        }, {
          name: `Reroll Cost`,
          value: `${rolls*4} <:ExtractLightCrystal:771330344443838474>\n${rolls*20} <:BCC:935995477881663488>`,
          inline: true
        }
      )
      .attachFiles([new Discord.MessageAttachment(image, 'extract.png')])
      .setImage('attachment://extract.png')
    return await message.channel.send(embed);

	},
};
  