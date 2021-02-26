const announce = require('./../lib/announce.js');
const currentWeek = require("./../lib/time.js");

module.exports = {
	name: 'mvp battle reminder',
	schedule: '0 19 * * Fri',
	async action() {
    const weekNum = currentWeek.week(new Date());
    if( weekNum%2 == 1 ) announce("<:mvpb:671889485037830154> **MVP Battle** sudah dimulai! Segera cari party yang mau ikut <:mvpb:671889485037830154>")
	},
};

