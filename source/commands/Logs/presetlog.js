const Discord = require("discord.js");
const Astroia = require("../../structures/client");

module.exports = {
  name: "presetlog",
  aliases: ["presetlogs", "setlogs", "setlogs"],
  description: "Permet de preset et crée tous les logs.",
  /**
   * @param {Astroia}
   */
  run: async (client, message, args, commandName) => {
    let pass = false;

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
    message.channel.send(await client.lang(`presetlog.message1`))

  let category = await message.guild.channels.create({
      name: '📰・Logs',
      type: 4,
      permissionOverwrites: [{
          id: message.guild.roles.everyone.id,
          allow: [Discord.PermissionFlagsBits.SendMessages,Discord.PermissionFlagsBits.ReadMessageHistory],
          deny: [Discord.PermissionFlagsBits.ViewChannel],
      }]
  })

  let channelInfo = [
      { name: '📁・logs-raid', dbKey: 'raidlogs_' },
      { name: '📁・logs-modération', dbKey: 'modlogs_' },
      { name: '📁・logs-message', dbKey: 'msglogs_' },
      { name: '📁・logs-vocal', dbKey: 'voicelogs_' },
      { name: '📁・logs-joinleave', dbKey: 'joinsleave_' }

  ]

  for (let i = 0; i < channelInfo.length; i++) {
      let channel = await message.guild.channels.create({
          name: channelInfo[i].name,
          type: 0,
          parent: category.id,
          permissionOverwrites: [{
              id: message.guild.roles.everyone.id,
              allow: [Discord.PermissionFlagsBits.SendMessages,Discord.PermissionFlagsBits.ReadMessageHistory],
              deny: [Discord.PermissionFlagsBits.ViewChannel],
          }]
      })

      client.db.set(`${channelInfo[i].dbKey}${message.guild.id}`, channel.id)
  }

  message.channel.send(await client.lang(`presetlog.message2`))
}
}
