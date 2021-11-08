const announce = require('./../lib/announce.js');

module.exports = {
	name: 'Loli Ruri Shadow reminder',
	schedule: '0 19 12-28 11 Fri,Sat,Sun',
	async action() {
    announce("Celebration Koi appears in Prontera South Gate! Drops **Royal Celebration Dreamy Chest**") 
  },
};