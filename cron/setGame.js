const client = require('./../lib/bot.js').client;

const games = [
  'king poring !card !poring !nolan',
  'event !reminder',
  'farming devil wing !smvp',
  'tangkap tangkap !pet',
  'GB ET dong !et',
  'Endless Tower !et',
  'Valhalla Ruins !vr',
  'rip bcc !extract',
  'ora nm -1 !oracle'
]

function setRandomGame(){
  const randomGame = games[Math.floor(Math.random()*games.length)];
  client.user.setActivity(randomGame);
}

module.exports = {
	name: 'set bot game',
	schedule: '*/60 * * * *',
  now: true,
	async action() {
    setRandomGame();
	},
};

