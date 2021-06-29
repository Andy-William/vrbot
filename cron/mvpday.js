const announce = require('./../lib/announce.js');
const currentWeek = require("./../lib/time.js");

module.exports = {
	name: 'mvp battle day reminder',
	schedule: '0 12 * * Fri',
	async action() {
    const weekNum = currentWeek.week(new Date());
    if( weekNum%2 == 1 ) announce("<:mvpb:671889485037830154> Today's event is **MVP Battle** at 19:00 server time <:mvpb:671889485037830154>")
	},
};

