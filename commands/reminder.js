const reminder = require('./../lib/reminder.js');

function usage(message){
  message.reply('Usage: `reminder <spasi> on/off`');
}

module.exports = {
	name: 'reminder',
	description: 'Reminder event RO',
	async execute(message, args) {
    if( args.length == 0 ) return usage(message);
    
    if( args[0].toLowerCase() === 'on' ){
      reminder.set(message.channel.id, true);
      message.channel.send('Reminder dinyalakan di channel ini.')
    }
    else if( args[0].toLowerCase() === 'off' ){
      reminder.set(message.channel.id, false);
      message.channel.send('Reminder dimatikan di channel ini.')
    }
    else usage(message);
	},
};