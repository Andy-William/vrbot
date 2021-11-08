const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 11 5 11 *',
	async action() {
    announce("🚧 Maintenance time! It will be done at 16:00 server time! 🚧")
	},
};

