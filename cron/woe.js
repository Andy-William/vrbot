const announce = require('./../lib/announce.js');

module.exports = {
	name: 'woe 15 minutes reminder',
	schedule: '45 20 * * Thu',
	async action() {
    announce("<:woe:671889485079773208> 15 minutes to **WOE**! Get ready... <:woe:671889485079773208>")
	},
};