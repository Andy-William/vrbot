const announce = require('../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 5 21 11 *',
	async action() {
    announce("🚧 Maintenance time! It will be done at 12:00 🚧")
	},
};

