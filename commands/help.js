const helpMessage = `Commands Help ❓
\`\`\`
!card ➜ cek harga kartu
!et ➜ Endless Tower
!oracle ➜ Oracle dungeon
!pet ➜ cek harga tangkap pet (price outdated)
!smvp ➜ SMVP minggu ini
!vr ➜ Valhalla ruins

!nolan ➜ Combined Fate Simulator (price outdated)
!poring !kp ➜ Card reroll simulator (price outdated)
!extract !re ➜ Oracle mirror simulator

!reminder ➜ Pengingat event

!help ➜ list command
!invite ➜ link invite bot\`\`\`
`

module.exports = {
	name: 'help',
	description: 'List command',
	async execute(message, args) {

    message.reply(helpMessage)
	},
};