const Discord = require("discord.js");

module.exports = {
  name: "unbl",
  description: "Enlève un user de la blacklist",
  usage: "unbl <ID>",
  run: async (client, message, args, commandName) => {
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

    if (args.length === 0) {
      return message.reply("Utilisez `+unbl <ID>`.");
    }

    const userID = args[0];
    const isBlacklisted = client.db.get(`blacklist_${userID}`);
    if (!isBlacklisted) {
      return message.reply("Cet utilisateur n'est pas blacklist.");
    }

    client.db.delete(`blacklist_${userID}`);

    client.guilds.cache.forEach((guild) => {
      guild.members.unban(userID).catch(console.error);
    });
    let userid = await client.users.fetch(userID)

    message.reply(`\`${userid.username}\` a été retiré de la blacklist.`);
  },
};
