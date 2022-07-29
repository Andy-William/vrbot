const db = require('../lib/mongo.js');
const reset = require('../lib/time.js');
const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

const fetch = require('node-fetch');

module.exports = {
	name: 'sudo',
  listener: /^[^\w]*cake|^$/i,
	description: 'Admin Stuff',
  hidden: true,
	async processMessage(message, args) {
    if( message.channel.id == process.env.DEV_CHANNEL_ID ){
      switch(args[0]){
        case 'vr':
          if( !args[1] || args[1] == '' ) return message.reply('invalid params. format: `sudo vr bosses`');
          else{
            message.react('✅')
            const data = args.slice(1).join(' ');
            const bossRegex = /((?:CN|EN|PH|TH|ID|VN)\s*\d{1,3})(.{15,})(?:\n|$)/gi;
            let bossData;
            let updates = []
            while( bossData = bossRegex.exec(data) ){
              const chData = {
                level: bossData[1].replace(/\s/g,'').toUpperCase(),
                boss: bossData[2],
                actor: message.author.username,
                id: message.guild.id,
                created_at: new Date().getTime()
              }
              updates.push({
                query: {id: chData.id, level: chData.level, actor: chData.actor},
                data: chData
              })
            }
            db.bulkUpdate('valhalla', updates, true).then(()=>message.channel.send(`updated`))
          }
          break;
        case 'oracle':
          if( !args[1] || args[1] == '' ) return message.reply('invalid params. format: `sudo oracle url/reset`');
          if( args[1] == 'reset' ){
            db.delete('oracle', {created_at: reset.nextReset()-1}).then(()=>{
              message.react('✅');
              message.channel.send(`oracle reseted`);
            })
          }
          else{
            const data = {
              url: args[1],
              created_at: reset.nextReset()-1
            }
            db.update('oracle', {}, data, {upsert: true}).then(()=>{
              message.react('✅');
            })
            return message.channel.send(`Oracle set to <${args[1]}>`);
          }
          break;
        case 'cake':
          if( !args[1] || args[1] == '' ) return message.reply('invalid params. format: `sudo cake url/reset`');
          if( args[1] == 'reset' ){
            db.delete('cake', {created_at: reset.nextReset()-1}).then(()=>{
              message.react('✅');
              message.channel.send(`cake reseted`);
            })
          }
          else{
            const data = {
              url: args[1],
              created_at: reset.nextReset()-1
            }
            db.update('cake', {}, data, {upsert: true}).then(()=>{
              message.react('✅');
            })
            return message.channel.send(`Cake set to <${args[1]}>`);
          }
          break;
        case 'et':
          if( args[1] == 'reset' ){
            db.delete('et', {created_at: reset.nextReset()-1}).then(()=>{
              message.react('✅');
              message.channel.send(`ET reseted`);
            })
          }
          else if( !args[1] || args[1] == '' ) return message.reply('invalid params. format: `sudo et url` or `sudo et reset`');
          else{
            const data = {
              url: args[1],
              created_at: reset.nextReset()-1
            }
            db.update('et', {}, data, {upsert: true}).then(()=>{
              message.react('✅');
              return message.channel.send(`ET set to <${args[1]}>`);
            })
          }
          break;
        case 'guildlist':
          let guilds = [];
          require('../lib/bot.js').client.guilds.cache.forEach((guild) => {
            guilds.push(guild.name)
          });
          const str = guilds.join("\n");
          const msgs = str.match(/.{1,1988}(\n|$)/gs); // split message every 2000 chars
          for( let i=0 ; i<msgs.length ; i++ ){
            await message.channel.send("```json\n"+msgs[i]+"```").catch((err)=>console.log(err));
          }
          break;
        case 'item':
          if( !args[1] || args[1] == '' || parseInt(args[1])==NaN || !args[2] ) return message.reply('invalid params. format: `sudo item price name`');
          const price = parseInt(args[1])
          const name = args.slice(2).join(' ');
          return await db.update('items', {name: name}, {price: price, lastRequest: Math.floor(new Date/1000)}).then((res)=>{
            message.react('✅');
            if( res.matchedCount == 0 ) return message.channel.send(`${name} not found`)
            if( res.modifiedCount == 0 ) return message.channel.send(`${name} not changed`)
            return message.channel.send(`${name} price set to ${price}`);
          })
      }
    }
    else if( message.channel.id == process.env.CAKE_CHANNEL_ID ){
      const attachment =  message.attachments.first()
      if( message.content.match(/^[^\w]*cake/i) ){ // capture weekly cake
        if( attachment && attachment.url ){
          const data = {
            url: attachment.url,
            created_at: reset.nextReset()-1
          }
          db.update('cake', {}, data, {upsert: true}).then(()=>{
            message.react('✅');
          })
          return message.channel.send(`Cake set to <${data.url}>`);
        }
      }
      else if( attachment && attachment.url.match(/oracle/i) ){
        const data = {
          url: attachment.url,
          created_at: reset.nextReset()-1
        }
        db.update('oracle', {}, data, {upsert: true}).then(()=>{
          message.react('✅');
        })
        return message.channel.send(`Oracle set to <${data.url}>`);
      }
    }
	},
  async processInteraction(interaction){
    if( interaction.channelId != process.env.DEV_CHANNEL_ID ) return;
    const url = interaction.options.getString('url');
    switch(interaction.options.getSubcommand()){
      case 'vr':
        const modal = new ModalBuilder().setCustomId('sudo').setTitle('admin import vr');
        const vrInput = new TextInputBuilder().setCustomId('vr').setLabel('paste here').setStyle(TextInputStyle.Paragraph);
        const actionRow = new ActionRowBuilder().addComponents(vrInput);
        modal.addComponents(actionRow);
        await interaction.showModal(modal);
      break;
      case 'oracle':
        if( url == 'reset' ){
          db.delete('oracle', {created_at: reset.nextReset()-1}).then(()=>{
            interaction.reply(`oracle reseted`);
          })
        }
        else{
          const data = {
            url: url,
            created_at: reset.nextReset()-1
          }
          db.update('oracle', {}, data, {upsert: true}).then(()=>{
            interaction.reply(`Oracle set to <${url}>`);
          })
        }
      break;
      case 'cake':
        if( url == 'reset' ){
          db.delete('cake', {created_at: reset.nextReset()-1}).then(()=>{
            interaction.reply(`cake reseted`);
          })
        }
        else{
          const data = {
            url: url,
            created_at: reset.nextReset()-1
          }
          db.update('cake', {}, data, {upsert: true}).then(()=>{
            interaction.reply(`Cake set to <${url}>`);
          })
        }
      break;
      case 'et':
        if( url == 'reset' ){
          db.delete('et', {created_at: reset.nextReset()-1}).then(()=>{
            interaction.reply(`ET reseted`);
          })
        }
        else{
          const data = {
            url: url,
            created_at: reset.nextReset()-1
          }
          db.update('et', {}, data, {upsert: true}).then(()=>{
            return interaction.reply(`ET set to <${url}>`);
          })
        }
      break;
      case 'guildlist':
        let guilds = [];
        require('../lib/bot.js').client.guilds.cache.forEach((guild) => {
          guilds.push(guild.name)
        });
        const str = guilds.join("\n");
        const msgs = str.match(/.{1,1988}(\n|$)/gs); // split message every 2000 chars
        for( let i=0 ; i<msgs.length ; i++ ){
          if( i==0 ) await interaction.reply("```json\n"+msgs[i]+"```");
          else await interaction.followUp("```json\n"+msgs[i]+"```");
        }
      break;
      case 'item':
        const price = interaction.options.getInteger('price');
        const name = interaction.options.getString('name');
        return await db.update('items', {name: name}, {price: price, lastRequest: Math.floor(new Date/1000)}).then((res)=>{
          if( res.matchedCount == 0 ) return interaction.reply(`${name} not found`)
          if( res.modifiedCount == 0 ) return interaction.reply(`${name} not changed`)
          return interaction.reply(`${name} price set to ${price}`);
        })
      break;
    }
  },
  async processModal(interaction){
    if( interaction.channelId != process.env.DEV_CHANNEL_ID ) return;
    const data = interaction.fields.getTextInputValue('vr')
    const bossRegex = /((?:CN|EN|PH|TH|ID|VN)\s*\d{1,3})(.{15,})(?:\n|$)/gi;
    let bossData;
    let updates = []
    while( bossData = bossRegex.exec(data) ){
      const chData = {
        level: bossData[1].replace(/\s/g,'').toUpperCase(),
        boss: bossData[2],
        actor: interaction.user.username,
        id: interaction.member.guild.id,
        created_at: new Date().getTime()
      }
      updates.push({
        query: {id: chData.id, level: chData.level, actor: chData.actor},
        data: chData
      })
      db.bulkUpdate('valhalla', updates, true).then(()=>interaction.reply(`updated`))
    }
    if( updates.length == 0 ) interaction.reply('nothing changed')
  }
};
