const announce = require('./../lib/announce.js');
const currentWeek = require("./../lib/time.js");

const events = [
  "<:kafrab:671889485176242225> Today's event is **Battle of Kafra** at 20:00 server time <:kafrab:671889485176242225>",
  "<:ufo:671889482865311749> Today's event is **Big Cat Invasion** at 20:00 server time <:ufo:671889482865311749>",
//  "<:poringb:671889485545603112> Hari ini ada **Poring Battle** ya, nanti jam 8 malam WIB <:poringb:671889485545603112>"
]
module.exports = {
	name: 'wednesday event day reminder',
	schedule: '0 12 * * Wed',
	async action() {
    const weekNum = currentWeek.week(new Date());
    announce(events[weekNum % events.length])
	},
};
