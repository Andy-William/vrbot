const helpMessage = `Commands Help ❓
\`\`\`
!card ➜ cek harga kartu
!et ➜ Endless Tower
!oracle ➜ Oracle dungeon
!pet ➜ cek harga tangkap pet
!smvp ➜ SMVP minggu ini
!vr ➜ Valhalla ruins

!nolan ➜ Combined Fate Simulator
!poring !kp ➜ Card reroll simulator

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