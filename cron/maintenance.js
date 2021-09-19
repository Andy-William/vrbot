const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 9 18 9 *',
	async action() {
    announce("🚧 Maintenance time! It will be done at 15:00 server time! 🚧")
	},
};

