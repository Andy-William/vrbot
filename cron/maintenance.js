const announce = require('../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 9 22 3 *',
	async action() {
    announce("🚧 Maintenance time! It will be done at 16:00 🚧")
	},
};

