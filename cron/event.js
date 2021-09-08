const announce = require('./../lib/announce.js');

module.exports = {
	name: 'Loli Ruri Shadow reminder',
	schedule: '0 19 * 9 Fri,Sat,Sun',
	async action() {
    announce("Firework show in Comodo! Limited time shop appears on **Comodo**") 
  },
};