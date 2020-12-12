const announce = require('./../lib/announce.js');

module.exports = {
	name: 'Loli Ruri Shadow reminder',
	schedule: '0 12 7-13 1 *',
	async action() {
    announce("Rainbow Light Spirit muncul di Mjolnir Mountain! Drop **Pet Egg, Colorful Shell, dan random Pet Item**") 
  },
};