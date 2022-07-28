const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const { ApplicationCommandOptionType, EmbedBuilder, AttachmentBuilder } = require('discord.js');

const success = [1,1,1,1,0.5,0.5,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4]
const broken = [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,1,1,1,1,1]
const safeItem = [0,0,0,0,1,2,3,4,6,10]
const fee = [10000,20000,30000,40000,50000,60000,70000,80000,90000,100000,100000,100000,100000,100000,100000]
const safeFee = [10000,20000,30000,40000,100000,220000,470000,910000,1630000,2740000]
const stone = [1,1,1,1,1,1,1,1,1,1,5,5,5,5,5]
const safeStone = [1,1,1,1,5,10,15,25,50,85]

async function drawImage(startLevel, finishLevel, safe){
  let refine = startLevel
  let stats = {
    totalItem: 0,
    totalZeny: 0,
    totalStone: 0,
    totalSuccess: 0,
    totalFail: 0,
    totalBroken: 0,
  }

  let dataPoint = [startLevel]
  let dataColor = ["white"]

  while( refine<finishLevel ){
    if( safe && safeItem[refine] ){ // safe refine
      stats.totalSuccess += 1
      dataColor.push("lime")

      stats.totalItem += safeItem[refine]
      stats.totalZeny += safeFee[refine]
      stats.totalStone += safeStone[refine]
      refine += 1
    }
    else{
      stats.totalZeny += fee[refine]
      stats.totalStone += stone[refine]
      if( Math.random() < success[refine] ){ // success refine
        stats.totalSuccess += 1
        refine += 1
        dataColor.push("lime")
      }
      else{ // fail refine
        stats.totalFail += 1
        if( Math.random() < broken[refine] ){ // broken
          stats.totalBroken += 1
          stats.totalItem += 1
          dataColor.push("red")
        }
        else dataColor.push("yellow")
        refine -= 1
      }
    }
    dataPoint.push(refine)
  }
  console.log('simul done')

  let width = 35 + dataPoint.length*5
  if( width > 1024 ) width = 1024
  const height = 300;
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });
  const gridColor = new Array(16).fill('rgba(255,255,255,0.2)')
  // gridColor[startLevel] = 'cyan'
  gridColor[finishLevel] = 'cyan'

  const configuration = {
    type: 'line',
    data: {
        labels: dataPoint.map(()=>""),
        datasets: [{
          fill: false,
          lineTension: 0,
          borderColor: "rgba(50,50,50,0.5)",
          data: dataPoint,
          pointBackgroundColor: dataColor
        }]
    },
    options: {
      plugins: {
        legend: {display: false}
      },
      showLine: false,
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

  return [image, stats];
}

async function getEmbed(startLevel, finishLevel, safe){
  const [image, stats] = await drawImage(startLevel, finishLevel, safe);
  const attachment = new AttachmentBuilder(image, {name: 'refine.png'});
  const embed = new EmbedBuilder()
    .setTitle(`Refine simulator from +${startLevel} to +${finishLevel}${safe?' (safe)':''}`)
    .setDescription(`Completed after **${stats.totalSuccess+stats.totalFail}x** refine!`)
    .addFields(
      {
        name: 'Success',
        value: stats.totalSuccess.toString(),
        inline: true
      },{
        name: 'Fail',
        value: stats.totalFail.toString(),
        inline: true
      },{
        name: 'Broken',
        value: stats.totalBroken.toString(),
        inline: true
      },{
        name: `Total Cost`,
        value: `Zeny: ${stats.totalZeny.toLocaleString()} <:Zeny:882599892659355659>\nStone: ${stats.totalStone} <:Oridecon:882599129811923004> <:Elunium:882599422318497874> <:Mithril:882599130835329084>\nEquip: ${stats.totalItem} <:SkyfireShardSharp:882599129883234334> <:HearthAsh:886264220029689886> <:SeaSpiritRemnants:968410446853963818> <:ExquisiteRepairingShard:886279421894463518>`
      }
    )
    .setImage('attachment://refine.png')
  return [embed, attachment];
}

module.exports = {
	name: 'refine',
	description: 'Refine Simulator',
  options: [
    {
      type: ApplicationCommandOptionType.Integer,
      name: 'start',
      description: 'Starting refine level (default: 0)',
      min: 0,
      max: 15,
      required: false
    }, {
      type: ApplicationCommandOptionType.Integer,
      name: 'end',
      description: 'Target refine level (default: 15)',
      min: 0,
      max: 15,
      required: false
    }, {
      type: ApplicationCommandOptionType.Boolean,
      name: 'safe',
      description: 'Safe refine when possible (default: false)',
      required: false
    },
  ],
	async processMessage(message, args) {
    await message.react('🆗');
    if( !args[0] ) return message.reply('Usage: `refine <space> start <space> target (<space> safe)`\nExample: `refine 0 10`')
    const startLevel = parseInt(args[0])
    const finishLevel = parseInt(args[1])
    const safe = args[2] && !!args[2].match(/safe/i)
    if( !(startLevel >= 0 && startLevel <= 15) ) return message.reply('Invalid level. Should be from 0-15')
    if( !(finishLevel >= 0 && finishLevel <= 15) ) return message.reply('Invalid level. Should be from 0-15')
    if( startLevel > finishLevel ) return message.reply('Target level must be higher than start level')

    const [embed, file] = await getEmbed(startLevel, finishLevel, safe);
    await message.channel.send({embeds: [embed], files: [file]});
	},
  async processInteraction(interaction){
    const startLevel = interaction.options.getInteger('start')||0;
    const finishLevel = interaction.options.getInteger('end')||15;
    const safe = interaction.options.getBoolean('safe')||false;
    if( startLevel > finishLevel ) return await interaction.reply({content: 'End level must be higher than start level', ephemeral: true});

    await interaction.deferReply();
    const [embed, file] = await getEmbed(startLevel, finishLevel, safe);
    await interaction.editReply({embeds: [embed], files:[file]});
  }
}
