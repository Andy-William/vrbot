const crypto = require('crypto')

module.exports = {
	name: 'key',
	description: 'secret key',
	async execute(message, args) {
    try{
      if( message.guild ) return;
      if( !args[0] ) return message.reply('need id');
      if( !args[0].match(/^\d+$/) ) return message.reply('invalid id');
      const sender = message.author.id
      console.log(sender)
      let key = {
        key: "-----BEGIN PUBLIC KEY-----\nMFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAKeeI0Wk93M9mAeV8/v//3OXs4K5fq3u\nlwvY6VZcK331CgHpz0DJxJjg3jc0k3N7873e2B3XWweMlcZiqoe0RxECAwEAAQ==\n-----END PUBLIC KEY-----",
        padding: crypto.constants.RSA_PKCS1_PADDING
      }
      let encrypted = crypto.publicEncrypt(key, Buffer.from(sender+';'+args[0]))

      message.reply(encrypted.toString('base64'))
    }catch(e){
      message.reply('invalid ID')
    }
	},
};