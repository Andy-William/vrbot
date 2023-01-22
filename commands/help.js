const helpMessage = `Commands Help ❓
\`\`\`
Informations
/cake ➜ Battle of Cake shop list
/card (color) ➜ Card prices
/et ➜ Endless Tower
/mvp (name)➜ MVP ranking/loot price
/oracle ➜ Oracle Dungeon
/pet ➜ Pet capture item prices
/smvp ➜ SMVP for this week
/vr ➜ Valhalla Ruins bosses

Simulators
/nolan ➜ Combined Fate simulator
/kp ➜ King poring card reroll simulator
/extract ➜ Oracle mirror simulator
/feast ➜ Feast Gacha simulator
/refine ➜ Refining simulator
/uars ➜ Ultimate Ancient Relic Shard simulator

Others
/reminder ➜ Event and maintenance reminder (channel admin only)
/help ➜ Commands List
/invite ➜ Link to invite me

Item prices are powered by poring.life
\`\`\`
Support: https://discord.gg/Dnu9w6tkrr
`

module.exports = {
	name: 'help',
	description: 'Commands list',
	async processMessage(message, args) {
    await message.reply(helpMessage)
	},
	async processInteraction(interaction) {
    await interaction.reply(helpMessage)
	},
};
