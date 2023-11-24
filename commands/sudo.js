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
      return message.channel.send(`use slash command!`);
    }
	},
  async processInteraction(interaction){
    if( interaction.channelId != process.env.DEV_CHANNEL_ID ) return;
    const url = interaction.options.getString('url');
    switch(interaction.options.getSubcommand()){
      case 'vr':
        if( url == 'reset' ){
          db.delete('vr', {created_at: reset.nextReset()-1}).then(()=>{
            interaction.reply(`vr reseted`);
          })
        }
        else{
          const data = {
            url: url,
            created_at: reset.nextReset()-1
          }
          db.update('vr', {}, data, {upsert: true}).then(()=>{
            interaction.reply(`VR set to <${url}>`);
          })
        }
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
        query: {level: chData.level},
        data: chData
      })
      db.bulkUpdate('valhalla', updates, true)
    }
    if( updates.length == 0 ) interaction.reply('nothing changed')
    else interaction.reply(`updated`)
  }
};
