const announce = require('./../lib/announce.js');

module.exports = {
	name: 'woe day reminder',
	schedule: '0 12 * * Thu',
	async action() {
    announce("<:woe:671889485079773208> Hari ini ada **War of Emperium** ya, nanti jam 9 malam WIB <:woe:671889485079773208>")
	},
};

