const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 10 29 6 *',
	async action() {
    announce("🚧 Maintenance time! It will be done at 17:00 server time! 🚧")
	},
};

