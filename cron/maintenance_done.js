const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
	schedule: '0 18 20 1 *',
	async action() {
    announce("🚧 Maintenance should be done! 🚧")
	},
};
