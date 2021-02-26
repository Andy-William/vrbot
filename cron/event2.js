const announce = require('./../lib/announce.js');

module.exports = {
	name: 'Loli Ruri Shadow reminder',
	schedule: '0 20 1-7 2 *',
	async action() {
    announce("Time Rift muncul di Payon South! Drop **Hunt Proof**") 
  },
};