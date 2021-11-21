module.exports = {
	name: 'invite',
	description: 'Link Invite',
	async execute(message, args) {
    return message.reply('<https://discordapp.com/oauth2/authorize?&client_id=555307757750845441&scope=bot&permissions=0>')
	},
};