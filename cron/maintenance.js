const announce = require('../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 8 19 4 *',
	async action() {
    announce("🚧 Maintenance time! It will be done at 19:00 🚧")
	},
};

