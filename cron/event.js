const announce = require('../lib/announce.js');
const serverTime = require('../lib/time.js');

module.exports = {
	name: 'Loli Ruri Shadow reminder',
	schedule: '0 5,10,15,20 5 2 *',
	async action() {
    let city;
    switch( serverTime.currentHour() ){
      case 5:
        city = "Prontera"
        break
      case 10:
        city = "Geffen"
        break
      case 15:
        city = "Morroc"
        break
      case 20:
        city = "Payon"
        break
    }
    announce("God of Wealth visits **" + city + "**! Claim your God of Wealth Lucky Bag")
  },
};
