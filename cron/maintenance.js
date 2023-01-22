const announce = require('../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 9 10 1 *',
	async action() {
    announce("🚧 Maintenance time! It will be done at 11:30 🚧")
	},
};

