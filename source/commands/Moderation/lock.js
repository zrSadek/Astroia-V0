const Astroia = require("../../structures/client/index");
const Discord = require('discord.js')

module.exports = {
  name: "lock",
  usage: "lock",
  aliases: ['mutelist'],
  description: "Empeche les membres de parler dans le channel",
      run: async(client, message, args, commandName) => {
    let pass = false
    let staff = client.staff
    if(!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true){
        if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
        if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
        if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
        if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
        if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true; 
        if(client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = true;   
   
    } else pass = true;
    
    if (pass === false) {
    if (client.noperm && client.noperm.trim() !== '') {
        return message.channel.send(client.noperm);
    } else {
        return; 
    }
}
    const channel = message.mentions.channels.first() || message.channel;
    channel.permissionOverwrites
      .edit(message.guild.roles.everyone, { SendMessages: false })
      .then(async () => {
        await message.channel.send({ content: await client.lang("lock.lock") + ` <#${channel.id}>` });
      })
      .catch(async (e) => {
        await message.channel.send({ content: await client.lang("lock.erreur") });
      });
      let Embed = new Discord.EmbedBuilder()
        .setColor(client.color)
        .setDescription(`${message.author} ${await client.lang(`lock.ll`)} ${channel}`)
        message.guild.channels.cache.get(client.db.get(`modlogs_${message.guild.id}`))?.send({ embeds: [Embed] })
  },
};
