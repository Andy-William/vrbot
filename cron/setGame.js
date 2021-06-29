const client = require('./../lib/bot.js').client;

const games = [
  '!help for command list'
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

