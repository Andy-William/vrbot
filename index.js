const dotenv = require('dotenv');
dotenv.config();
const client = require('./lib/bot.js').client;

client.on('messageCreate', (message) => {
  let log = `${message.channel.id}-(${message.author.id}) ${message.author.username}: ${message.content}`
  if( message.guild ) log = `[${message.guild.id}-${message.guild.name}]` + log
  const errorHandler = function(err){
    let msg;
    try{
      msg = err.message || err;
    }
    catch(_){
      msg = err;
    }
    console.log(msg,err)
    client.channels.cache.get(process.env.DEV_CHANNEL_ID).send(log);
    client.channels.cache.get(process.env.DEV_CHANNEL_ID).send(msg);
    message.reply(msg||'got error, try again').catch((err)=>{
        console.log(err);
        message.author.send('got error, I probably don\'t have write access to the channel')
      }
    )
  }

  try{
    console.log(log)
    if( message.author.bot && message.channel.id != process.env.CAKE_CHANNEL_ID ) return;

    // pamernoko
    if( message.channel.id == process.env.PAMERNOKO_CHANNEL_ID ){
      message.react('👍').then(() => message.react('❤️')).then(() => message.react('😆')).then(() => message.react('😮')).then(() => message.react('😢')).then(() => message.react('😡'))
    }
    else if( message.channel.id == process.env.RUMAHAN_CHANNEL_ID && !message.author.bot ){
      const attachment =  message.attachments.first()
      if( attachment && attachment.url.match(/\.(jpg|png)$/) ){
        console.log(attachment.url)
        console.log(message.guild.bannerURL())
        message.guild.setBanner(attachment.url).then(res=>{console.log('banner changed')}).catch(err=>console.log(err));
      }
    }


    const args = message.content.split(/ +/).slice(1); // split arguments
    if( args.length > 0 ){
      const commandName = args.shift().toLowerCase();    // first argument is command name

      let match;
      const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.alias && (match = commandName.match(cmd.alias)));
      if( !command ) return;
      if( match ) args.unshift(...match.slice(1));
      command.processMessage(message, args).catch(errorHandler);
    }
  }catch(err){
    errorHandler(err);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN).then(()=>{
  require('./lib/cron.js').init();
}).catch(console.error);

client.on('error', (err) => console.log(err));

client.on("guildCreate", (guild) => {
  client.channels.cache.get(process.env.DEV_CHANNEL_ID).send(`Joined new guild: ${guild.name}`);
});

client.on("guildDelete", (guild) => {
  client.channels.cache.get(process.env.DEV_CHANNEL_ID).send(`Left guild: ${guild.name}`);
})

process.on('unhandledRejection', error => {
    console.log(error);
    client.channels.cache.get(process.env.DEV_CHANNEL_ID).send("error sesuatu cek log! <@273387024856383489>");
});

require('./event_handler.js');
require('./web.js');
