const announce = require('./../lib/announce.js');
const currentWeek = require("./../lib/time.js");

module.exports = {
	name: 'mvp battle day reminder',
	schedule: '0 12 * * Fri',
	async action() {
    const weekNum = currentWeek.week(new Date());
    if( weekNum%2 == 0 ) announce("<:mvpb:671889485037830154> Hari ini ada **MVP Battle** ya, nanti jam 7 malam WIB <:mvpb:671889485037830154>")
	},
};

