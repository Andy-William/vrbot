const helpMessage = `Commands Help ❓
\`\`\`
!cake ➜ battle of cake
!card ➜ cek harga kartu
!et ➜ Endless Tower
!mvp ➜ MVP Ranking
!oracle !ora ➜ Oracle dungeon
!pet ➜ cek harga tangkap pet
!smvp ➜ SMVP minggu ini
!vr ➜ Valhalla ruins

!nolan ➜ Combined Fate Simulator
!poring !kp ➜ Card reroll simulator
!extract !re ➜ Oracle mirror simulator
!feast ➜ Feast Gacha Simulator

!reminder ➜ Pengingat event

!help ➜ list command
!invite ➜ link invite bot

Item prices are powered by poring.life
\`\`\`
Support: https://discord.gg/Dnu9w6tkrr
`

module.exports = {
	name: 'help',
	description: 'List command',
	async execute(message, args) {
    message.reply(helpMessage)
	},
};