const Discord = require("discord.js");

module.exports = {
  name: "bl",
  description: "Blacklist une personne du bot",
  run: async (client, message, args, commandName) => {
    let pass = false;
        let staff = client.staff;

        if (!staff.includes(message.author.id) && !client.config.buyers.includes(message.author.id) && client.db.get(`owner_${message.author.id}`) !== true) {
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "1" && message.member.roles.cache.some(r => client.db.get(`perm1.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "2" && message.member.roles.cache.some(r => client.db.get(`perm2.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "3" && message.member.roles.cache.some(r => client.db.get(`perm3.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "4" && message.member.roles.cache.some(r => client.db.get(`perm4.${message.guild.id}`)?.includes(r.id))) pass = true;
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "5" && message.member.roles.cache.some(r => client.db.get(`perm5.${message.guild.id}`)?.includes(r.id))) pass = true; 
            if (client.db.get(`perm_${commandName}.${message.guild.id}`) === "public") pass = true;
        } else pass = true;

        if (!pass) return message.channel.send(await client.lang(`perm`));
       
        if (args[0]) {
          const member = message.mentions.members.first() || client.users.cache.get(args[0]) || await client.users.fetch(args[0]).catch(() => false) 
         
          if (!member) {
            return message.reply("Impossible de trouver l'utilisateur spécifié.");
          }
    
          if (client.db.get(`blacklist_${member.id}`) === true) {
            return message.reply(`${member.username || member.user.username} est déjà blacklisté.`);
          }
    
          if (client.db.get(`owner_${member.id}`) === true || client.config.buyers.includes(member.id)) {
            return message.channel.send(`Je ne peux pas blacklist un owner ou buyer bot`);
          }
    
          client.guilds.cache.forEach((guild) => {
            guild.members.ban(member, { reason: `Blacklisted | by ${message.author.tag}` }).catch(console.error);
          });
    
          client.db.set(`blacklist_${member.id}`, true);
          message.reply(`**${member.username || member.user.username}** a été blacklisté de tous les serveurs (${client.guilds.cache.size}).`);
        } else {
          const data = client.db
            .all()
            .filter((data) => data.ID.startsWith(`blacklist_`))
            .sort((a, b) => b.data - a.data);
          const count = 15;
          let p0 = 0;
          let p1 = count;
          let page = 1;
          let embed = new Discord.EmbedBuilder()
            .setTitle(`Blacklist`)
            .setFooter(client.footer)
            .setColor(client.color);
    
          let description = (await Promise.all(data
            .slice(p0, p1)
            .map(async (m, index) => {
              const userID = m.ID.split("_")[1];
              const userTag = await client.users.fetch(userID).catch(() => null);
              if (userTag) {
                return `\`${index + 1} - \`[\`${userTag.tag}\`](https://discord.com/users/${userID})\` (${userID})\``;
              } else {
                return `\`${index + 1} - User inconnue (${userID})\``;
              }
            })))
            .join("\n");
    
          if (!description) {
            description = "Aucune blacklist trouvée";
          }
    
          embed.setDescription(description);
          message.channel.send({ embeds: [embed] });
        }
      }
    }