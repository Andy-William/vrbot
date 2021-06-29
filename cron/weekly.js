const announce = require('./../lib/announce.js');
const currentWeek = require("./../lib/time.js");

const events = [
  "<:kafrab:671889485176242225> **Battle of Kafra** registration is open at South Gate! <:kafrab:671889485176242225>",
  "<:ufo:671889482865311749> **Big Cat Invasion** is starting soon! Get ready at Prontera West Gate <:ufo:671889482865311749>",
//  "<:poringb:671889485545603112> **Poring Battle** akan dimulai dalam 5 menit! Yang mau ikut ke Poring Island ya <:poringb:671889485545603112>"
]

module.exports = {
	name: 'wednesday event reminder',
	schedule: '55 19 * * Wed',
	async action() {
    const weekNum = currentWeek.week(new Date());
    announce(events[weekNum % events.length])
	},
};
