const announce = require('../lib/announce.js');

module.exports = {
	name: 'woe day reminder',
	schedule: '0 12 * * Thu',
	async action() {
    announce("<:woe:671889485079773208> Today's event is **War of Emperium** at 21:00 server time <:woe:671889485079773208>")
	},
};

