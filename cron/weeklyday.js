const announce = require('./../lib/announce.js');
const currentWeek = require("./../lib/time.js");

const events = [
  "<:ufo:671889482865311749> Hari ini ada **Big Cat Invasion**, nanti jam 8 malam WIB <:ufo:671889482865311749>",
  "<:kafrab:671889485176242225> Hari ini ada **Battle of Kafra**, nanti jam 8 malam WIB <:kafrab:671889485176242225>",
  "<:poringb:671889485545603112> Hari ini ada **Poring Battle** ya, nanti jam 8 malam WIB <:poringb:671889485545603112>"
]
module.exports = {
	name: 'wednesday event day reminder',
	schedule: '0 12 * * Wed',
	async action() {
    const weekNum = currentWeek.week(new Date());
    announce(events[weekNum % events.length])
	},
};
