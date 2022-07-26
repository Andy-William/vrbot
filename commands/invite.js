module.exports = {
	name: 'invite',
	description: 'Link Invite',
	async execute(message, args) {
    return message.reply('<https://discord.com/api/oauth2/authorize?client_id=555307757750845441&permissions=0&scope=applications.commands%20bot>')
	},
};
