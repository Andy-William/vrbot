const announce = require('../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
	schedule: '0 19 19 4 *',
	async action() {
    announce("🚧 Maintenance should be done! 🚧")
	},
};
