const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.DEV_SERVER_ID;


const fs = require('node:fs');
const { SlashCommandBuilder } = require('@discordjs/builders');

const commands = [];
const commandFiles = fs.readdirSync(__dirname+'/../commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./../commands/${file}`);
  if( command.hidden ) continue;
  const data = new SlashCommandBuilder()
    .setName(command.name)
    .setDescription(command.description)
  commands.push(data.toJSON());
}

console.log(commands)

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
