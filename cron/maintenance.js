const announce = require('./../lib/announce.js');

module.exports = {
	name: 'maintenance reminder',
	schedule: '0 9 28 3 *',
	async action() {
    announce("🚧 Maintenance time! It will be done <t:1648476000:R> 🚧")
	},
};

