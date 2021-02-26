const mvp = require('./../lib/mvp.js');

module.exports = {
	name: 'update mvp values',
	schedule: '0 * * * *',
  now: true,
	async action() {
    mvp.updateAll();
	},
};
