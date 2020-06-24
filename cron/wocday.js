const announce = require('./../lib/announce.js');

module.exports = {
	name: 'woc day reminder',
	schedule: '0 12 * * Sun',
	async action() {
    announce("<:woc:671889485541277726> Hari ini ada **War of Crystal** ya, nanti jam 9 malam WIB <:woc:671889485541277726>")
	},
};

