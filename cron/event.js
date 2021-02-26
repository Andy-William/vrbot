const announce = require('./../lib/announce.js');

module.exports = {
	name: 'Loli Ruri Shadow reminder',
	schedule: '0 10,12,19,21,23 16 2 *',
	async action() {
    announce("God of Wealth muncul di Prontera, Geffen, Morroc, dan Payon! Drop **Zeny**") 
  },
};