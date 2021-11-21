const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 8 25 11 *',
	async action() {
    announce("🚧 Maintenance time! It will be done at 19:00 server time! 🚧")
	},
};

