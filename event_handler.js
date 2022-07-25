const { client } = require("./lib/bot");
const { InteractionType } = require('discord.js');

client.on('interactionCreate', async interaction =>{
    if( interaction.type !== InteractionType.ApplicationCommand ) return;

    console.log(interaction);

    let log = `${interaction.channelId}-(${interaction.user.id}) ${interaction.user.username}: ${interaction.commandName}`
    if( interaction.member ) log = `[${interaction.member.guild.id}-${interaction.member.guild.name}]` + log

    const command = client.commands.get(interaction.commandName)
    if( !command ) return;

    try{
        await command.processInteraction(interaction)
    } catch (error){
        console.error(error);
        client.channels.cache.get(process.env.DEV_CHANNEL_ID).send(log);
        client.channels.cache.get(process.env.DEV_CHANNEL_ID).send(error);
        await interaction.reply({ content: 'Error! Please report to support server', ephemeral: true });
    }
})