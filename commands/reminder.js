const reminder = require('./../lib/reminder.js');

function usage(message){
  message.reply('Usage: `reminder <space> on/off`');
}

module.exports = {
	name: 'reminder',
	description: 'Reminder event RO',
	async execute(message, args) {
    if( args.length == 0 ) return usage(message);
    
    if( args[0].toLowerCase() === 'on' ){
      reminder.set(message.channel.id, true);
      message.channel.send('Reminder turned on for this channel.')
    }
    else if( args[0].toLowerCase() === 'off' ){
      reminder.set(message.channel.id, false);
      message.channel.send('Reminder turned off for this channel.')
    }
    else usage(message);
	},
};