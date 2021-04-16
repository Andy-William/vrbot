const announce = require('./../lib/announce.js');

module.exports = {
	name: 'Loli Ruri Shadow reminder',
	schedule: '0 19 10-16 4 *',
	async action() {
    announce("Phen, Marc, Marina muncul di South Gate! Drop **Deepsea Chest, Shinewhole Aquarius**") 
  },
};