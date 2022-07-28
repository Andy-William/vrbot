const announce = require('../lib/announce.js');

module.exports = {
	name: 'woc day reminder',
	schedule: '0 12 * * Sun',
	async action() {
    announce("<:woc:671889485541277726> Today's event is **War of Crystal** at 21:00 server time <:woc:671889485541277726>")
	},
};

