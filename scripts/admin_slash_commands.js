const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
require('dotenv').config();
const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.DEV_SERVER_ID;

const { SlashCommandBuilder } = require('@discordjs/builders');

const data = new SlashCommandBuilder()
  .setName('sudo')
  .setDescription('admin command')
  .setDefaultMemberPermissions(0)
  .addSubcommand(subcommand => subcommand
    .setName('vr')
    .setDescription('set vr')
    .addStringOption(option=> option
      .setName('url')
      .setDescription('image url ("reset" to delete)')
      .setRequired(true)))
  .addSubcommand(subcommand => subcommand
    .setName('oracle')
    .setDescription('set oracle')
    .addStringOption(option=> option
      .setName('url')
      .setDescription('image url ("reset" to delete)')
      .setRequired(true)))
  .addSubcommand(subcommand => subcommand
    .setName('cake')
    .setDescription('set boc')
    .addStringOption(option=> option
      .setName('url')
      .setDescription('image url ("reset" to delete)')
      .setRequired(true)))
  .addSubcommand(subcommand => subcommand
    .setName('et')
    .setDescription('set et')
    .addStringOption(option=> option
      .setName('url')
      .setDescription('image url ("reset" to delete)')
      .setRequired(true)))
  .addSubcommand(subcommand => subcommand
    .setName('guildlist')
    .setDescription('list of joined guilds'))
  .addSubcommand(subcommand => subcommand
    .setName('item')
    .setDescription('set item price')
    .addStringOption(option=> option
      .setName('name')
      .setDescription('item name')
      .setRequired(true))
    .addIntegerOption(option=> option
      .setName('price')
      .setDescription('item price')
      .setRequired(true)))

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: [data.toJSON()] },
		);

		console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})();
