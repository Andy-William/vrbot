const client = require('./../lib/bot.js').client;

const games = [
  'king poring !card !poring !nolan',
  // 'judi mora',
  // 'judi hollgrehenn',
  'event !reminder',
  'farming devil wing !smvp',
  'tangkap tangkap !pet',
  'GB ET dong !et',
  'Endless Tower !et',
  'Valhalla Ruins !vr'
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

