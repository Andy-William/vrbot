const fs = require('fs');
const stringSimilarity = require('string-similarity');
const Canvas = require('canvas');

Canvas.registerFont('./assets/fonts/Roboto-Regular.ttf', {family:'roboto'})
Canvas.registerFont('./assets/fonts/Calibri Regular.ttf', {family:'calibri'})

let assets = {}
fs.readFileSync('./.glitch-assets', 'utf8').split("\n").forEach((row) => {
  try {
    const asset = JSON.parse(row);
    const name = asset.name.match(/(.*)\.png/)[1]
    assets[name] = asset.url + '?time=' + (new Date()-0)
  } catch (e) {}
})
// console.log(assets)

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