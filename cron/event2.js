const announce = require('./../lib/announce.js');

module.exports = {
	name: 'Loli Ruri Shadow reminder',
	schedule: '0 12 14-20 1 *',
	async action() {
    announce("Rainbow Light Spirit muncul di Plain of Ida! Drop **Pet Egg, Colorful Shell, dan random Pet Item**") 
  },
};