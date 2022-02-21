const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 9 23 2 *',
	async action() {
    announce("🚧 Maintenance time! It will be done at 17:00 server time! 🚧")
	},
};

