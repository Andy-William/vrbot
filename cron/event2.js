const announce = require('./../lib/announce.js');

module.exports = {
	name: 'Lantern festival reminder',
	schedule: '0 20 25-28 6 *',
	async action() {
    announce("Naughty Yoyo muncul di West Gate! Berhadiah Queen’s Luggage/Leaf Rosette")
	},
};

