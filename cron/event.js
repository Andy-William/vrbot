const announce = require('./../lib/announce.js');

module.exports = {
	name: 'Loli Ruri Shadow reminder',
	schedule: '0 20 24-30 8 *',
	async action() {
    announce("Strange Poring muncul di Poring Island! Max 5 **Meteor Chest** per char") 
  },
};