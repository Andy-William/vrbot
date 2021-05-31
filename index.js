const dotenv = require('dotenv');
dotenv.config();
const client = require('./lib/bot.js').client;

const prefix = '!';
client.on('message', (message) => {
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
    message.reply(msg||'ada error, coba lagi aja');
    client.channels.get(process.env.DEV_CHANNEL_ID).send(log);
    client.channels.cache.get(process.env.DEV_CHANNEL_ID).send(msg);
  }
  
  try{
    console.log(log)
    if( message.author.bot ) return;
    
    // pamernoko
    if( message.channel.id == process.env.PAMERNOKO_CHANNEL_ID ){
      if( message.author.bot || !message.attachments.first() ) message.delete();
      else{
        message.react('👍').then(() => message.react('❤️')).then(() => message.react('😆')).then(() => message.react('😮')).then(() => message.react('😢')).then(() => message.react('😡'))
      }
      return;
    }

    if ( message.content.startsWith(prefix) ){
      const args = message.content.slice(1).split(/ +/); // split arguments
      const commandName = args.shift().toLowerCase();    // first argument is command name

      let match;
      const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.alias && (match = commandName.match(cmd.alias)));
      if( !command ) return;
      if( match ) args.unshift(...match.slice(1));
      command.execute(message, args).catch(errorHandler);
    }
    else{
      // try listener commands
      let match;
      const command = client.commands.find(cmd => cmd.listener && (match = message.content.match(cmd.listener)));
      if( !command ) return;
      command.execute(message, match.slice(1)).catch(errorHandler);
    }
  }catch(err){
    console.log(err);
    let msg;
    try{
      msg = err.message;
    }
    catch(_){
      msg = err;
    }
    message.reply(msg||'ada error, coba lagi aja');
    client.channels.cache.get(process.env.DEV_CHANNEL_ID).send(log);
    client.channels.cache.get(process.env.DEV_CHANNEL_ID).send(msg);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN).then(()=>{
  require('./lib/cron.js').init();
  
  setTimeout(()=>{
    client.guilds.cache.forEach((guild) => {
        console.log(guild.name || guild.id );
    });
  }, 1000)
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

require('./web.js');