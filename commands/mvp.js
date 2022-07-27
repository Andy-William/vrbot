const mvp = require('./../lib/mvp.js');
const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
  name: 'mvp',
  description: 'MVP Loot Prices',
  options: [
    {
      type: ApplicationCommandOptionType.String,
      name: 'name',
      description: 'MVP name',
      required: false
    }
  ],
  async processMessage(message, args){
    message.react('🆗');
    args = args.join(' ');

    if( args ){
      mvp.getLoot(args, false).then(res=>{
        const name = res.name
        if( !res.name ){
          return message.reply("not found");
        }
        let str = `**${name}**\n`
        res.loot.forEach(item=>{
          str += `${item.name} ${item.price}\n`
        })
        return message.channel.send(str);
      })
    } else {
      let msgs = ('MVP list (best to worst)\n'+(await mvp.getRanking()).map((v,idx)=>`${idx+1}. ${v[1]}`).join('\n')).match(/.{1,1988}(\n|$)/gs); // split message every 2000 chars
      for( let i=0 ; i<msgs.length ; i++ ){
        await message.channel.send("```json\n"+msgs[i]+"```")
      }
    }
  },
  async processInteraction(interaction){
    let name = interaction.options.getString('name');
    if( name ){
      const boss = await mvp.getLoot(name, false)
        name = boss.name
        if( !name ){
          return await interaction.reply({content: "Not found", ephemeral: true});
        }
        let str = `**${name}**\n`
        boss.loot.forEach(item=>{
          str += `${item.name} ${item.price}\n`
        })
        return await interaction.reply(str);
    } else {
      let msgs = ('MVP list (best to worst)\n'+(await mvp.getRanking()).map((v,idx)=>`${idx+1}. ${v[1]}`).join('\n')).match(/.{1,1988}(\n|$)/gs); // split message every 2000 chars
      for( let i=0 ; i<msgs.length ; i++ ){
        if( i==0 ) await interaction.reply("```json\n"+msgs[i]+"```");
        else await interaction.followUp("```json\n"+msgs[i]+"```");
      }
    }
  }
};
