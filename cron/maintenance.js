const announce = require('../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 6 26 10 *',
	async action() {
    announce("🚧 Maintenance time! It will be done at 16:00 🚧")
	},
};

