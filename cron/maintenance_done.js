const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance done reminder',
	schedule: '0 18 27 8 *',
	async action() {
    announce("🚧 Maintenance should be done! 🚧")
	},
};
