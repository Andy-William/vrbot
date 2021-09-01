const announce = require('./../lib/announce.js');

module.exports = {
	name: 'Loli Ruri Shadow reminder',
	schedule: '30 20 * 9 Fri,Sat,Sun',
	async action() {
    announce("Firework show is over! Mysterious items appear on the Comodo Beach") 
  },
};