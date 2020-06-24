const announce = require('./../lib/announce.js');

module.exports = {
	name: 'Lantern festival reminder',
	schedule: '0 10,12,19,21,23 8 2 *',
	async action() {
    // announce("Moon Agent muncul di Prontera! Kuis berhadiah")
	},
};

