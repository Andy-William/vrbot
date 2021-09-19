const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
	schedule: '0 15 18 9 *',
	async action() {
    announce("🚧 Maintenance should be done! 🚧")
	},
};
