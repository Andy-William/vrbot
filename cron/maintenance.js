const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 9 20 1 *',
	async action() {
    announce("🚧 Maintenance time! It will be done at 18:00 server time! 🚧")
	},
};

