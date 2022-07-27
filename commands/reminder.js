const reminder = require('./../lib/reminder.js');
const { ApplicationCommandOptionType } = require('discord.js');

function usage(message){
  message.reply('Usage: `reminder <space> on/off`');
}

module.exports = {
	name: 'reminder',
	description: 'Reminder event RO',
  permission: 16, // manage channel
  options:[
    {
      type: ApplicationCommandOptionType.String,
      name: 'set',
      description: 'Set reminder (on/off)',
      choices: [
        {name: 'on', value: 'on'},
        {name: 'off', value: 'off'},
      ],
      required: true
    }
  ],
	async processMessage(message, args) {
    if( args.length == 0 ) return usage(message);

    if( args[0].toLowerCase() === 'on' ){
      reminder.set(message.channel.id, true);
      return message.channel.send('Reminder turned on for this channel.')
    }
    else if( args[0].toLowerCase() === 'off' ){
      reminder.set(message.channel.id, false);
      return message.channel.send('Reminder turned off for this channel.')
    }
    else return usage(message);
	},
  async processInteraction(interaction){
    const status = interaction.options.getString('set');

    if( status == 'on' ){
      reminder.set(interaction.channelId, true);
      await interaction.reply({content: 'Reminder turned on for this channel', ephemeral: true})
    }
    else if( status == 'off' ){
      reminder.set(interaction.channelId, false);
      await interaction.reply({content: 'Reminder turned off for this channel', ephemeral: true})
    }
  }
};
