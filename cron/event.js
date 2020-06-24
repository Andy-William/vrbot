const announce = require('./../lib/announce.js');

module.exports = {
	name: 'Loli Ruri Shadow reminder',
	schedule: '0 13,16,20 22-28 6 *',
	async action() {
    announce("Time rift muncul di Morroc/Sograt/Pyramid! Berhadiah max 5x per hari") 
  },
};
