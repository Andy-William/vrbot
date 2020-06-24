const fs = require('fs');
const path = require('path'); 
const stringSimilarity = require('string-similarity');
const Canvas = require('canvas');

Canvas.registerFont('./assets/fonts/Roboto-Regular.ttf', {family:'roboto'})
Canvas.registerFont('./assets/fonts/Calibri Regular.ttf', {family:'calibri'})

let assets = {}

fs.readdirSync('./assets').forEach(file=>{
    if (path.extname(file) == ".png") assets[path.basename(file, '.png')] = './assets/' + file; 
})

let canvasAssets = {}

function getClosestName(name){
  if( assets[name] ) return assets[name];
  const bestmatch = stringSimilarity.findBestMatch(name, Object.keys(assets)).bestMatch;
  if( bestmatch.rating < 0.4 ){
    console.log(name)
    console.log(bestmatch)
    return 'https://cdn.glitch.com/48c7ed45-371e-47bc-b3cd-bbf3cb69a60a%2Fquestion_mark-50x50.png';
  }
  return assets[bestmatch.target];
}

exports.get = getClosestName;
exports.getCanvas = async function(name){
  const url = getClosestName(name);
  if( !canvasAssets[url] ){
    canvasAssets[url] = await Canvas.loadImage(getClosestName(name));
  }
  return canvasAssets[url];
}