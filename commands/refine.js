const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const Discord = require('discord.js');

const success = [1,1,1,1,0.5,0.5,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4,0.4]
const broken = [0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,1,1,1,1,1]
const safeItem = [0,0,0,0,1,2,3,4,6,10]
const fee = [10000,20000,30000,40000,50000,60000,70000,80000,90000,100000,110000,120000,130000,140000,150000]
const safeFee = [10000,20000,30000,40000,100000,220000,470000,910000,1630000,2740000]
const stone = [1,1,1,1,1,1,1,1,1,1,5,5,5,5,5]
const safeStone = [1,1,1,1,5,10,15,25,50,85]

module.exports = {
	name: 'refine',
	description: 'Refine Simulator',
	async execute(message, args) {
    await message.react('🆗');
    if( !args[0] ) return message.reply('Usage: `refine <space> start <space> target (<space> safe)`\nExample: `refine 0 10`')
    const startLevel = parseInt(args[0])
    const finishLevel = parseInt(args[1])
    const safe = args[2] && !!args[2].match(/safe/i)
    if( !(startLevel >= 0 && startLevel <= 15) ) return message.reply('Invalid level. Should be from 0-15')
    if( !(finishLevel >= 0 && finishLevel <= 15) ) return message.reply('Invalid level. Should be from 0-15')
    if( startLevel > finishLevel ) return message.reply('Target level must be higher than start level')

    let refine = startLevel
    let totalItem = 0
    let totalZeny = 0
    let totalStone = 0
    let totalSuccess = 0
    let totalFail = 0
    let totalBroken = 0
    
    let dataPoint = [startLevel]
    let dataColor = ["white"]
    
    
    while( refine!=finishLevel ){
      if( safe && safeItem[refine] ){ // safe refine
        totalSuccess += 1
        dataColor.push("lime")
        
        totalItem += safeItem[refine]
        totalZeny += safeFee[refine]
        totalStone += safeStone[refine]
        refine += 1
      }
      else{
        totalZeny += fee[refine]
        totalStone += stone[refine]
        if( Math.random() < success[refine] ){ // success refine
          totalSuccess += 1
          refine += 1
          dataColor.push("lime")
        }
        else{ // fail refine
          totalFail += 1
          if( Math.random() < broken[refine] ){ // broken
            totalBroken += 1
            totalItem += 1
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
    
    const embed = new Discord.MessageEmbed()
      .setTitle(`Refine simulator from +${startLevel} to +${finishLevel}${safe?' (safe)':''}`)
      .setDescription(`Completed after **${totalSuccess+totalFail}x** refine!`)
      .addFields(
        { 
          name: 'Success',
          value: totalSuccess,
          inline: true
        },{ 
          name: 'Fail',
          value: totalFail,
          inline: true
        },{ 
          name: 'Broken',
          value: totalBroken,
          inline: true
        },{
          name: `Total Cost`, 
          value: `Zeny: ${totalZeny.toLocaleString()} <:Zeny:882599892659355659>\nStone: ${totalStone} <:Oridecon:882599129811923004> <:Elunium:882599422318497874> <:Mithril:882599130835329084>\nEquip: ${totalItem} <:SkyfireShardSharp:882599129883234334> <:HearthAsh:886264220029689886> <:ExquisiteRepairingShard:886279421894463518>`
        }
      )
      .attachFiles([new Discord.MessageAttachment(image, 'refine.png')])
      .setImage('attachment://refine.png')
    await message.channel.send(embed)
	},
}
  