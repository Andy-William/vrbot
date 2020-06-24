const announce = require('./../lib/announce.js');

module.exports = {
	name: 'woc 15 minutes reminder',
	schedule: '45 20 * * Sun',
	async action() {
    announce("<:woc:671889485541277726> 15 menit lagi **WOC**! Siap-siap ya... <:woc:671889485541277726>")
	},
};