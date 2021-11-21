const helpMessage = `Commands Help ❓
\`\`\`
!cake ➜ Battle of Cake shop list
!card (color) ➜ Card prices
!et ➜ Endless Tower
!mvp (name)➜ MVP ranking/loot price
!oracle !ora ➜ Oracle Dungeon
!pet ➜ Pet capture item prices
!smvp ➜ SMVP for this week
!vr ➜ Valhalla Ruins bosses

!nolan ➜ Combined Fate simulator
!poring !kp ➜ Card reroll simulator
!extract !re ➜ Oracle mirror simulator
!feast ➜ Feast Gacha simulator
!refine ➜ Refining simulator

!reminder ➜ Event reminder

!help ➜ Command List
!invite ➜ Link to invite me

Item prices are powered by poring.life
\`\`\`
Support: https://discord.gg/Dnu9w6tkrr
`

module.exports = {
	name: 'help',
	description: 'List command',
	async execute(message, args) {
    return message.reply(helpMessage)
	},
};