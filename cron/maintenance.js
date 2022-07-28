const announce = require('../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 10 12 7 *',
	async action() {
    announce("🚧 Maintenance time! It will be done at 14:00 🚧")
	},
};

