const announce = require('./../lib/announce.js');

module.exports = {
	name: 'Loli Ruri Shadow reminder',
	schedule: '0 20 26-30 11 *',
	async action() {
    announce("Giant Peco Peco muncul di Sograt Desert! Drop **Delicious Meat Chunk** (max 150)") 
  },
};