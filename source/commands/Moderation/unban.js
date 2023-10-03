const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    name: "unban",
    description: "Permet de débannir l'utilisateur indiqué",
    usages: "unban <utilisateur/id>",
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
        } else {
            pass = true;
        }

        if (pass === false) return message.channel.send(await client.lang(`perm`));

        let user = args[0];
        if (!user) return message.channel.send("Veuillez spécifier un ID d'utilisateur valide.");

        let bannedUser;
            bannedUser = await client.users.fetch(user);
      
        message.guild.members.unban(bannedUser).then(async () => {
            await message.channel.send(`**${bannedUser.tag}** ${await client.lang(`unban.message1`)}`);
        }).catch(async () => {
            await message.channel.send(`<@${user}> ${await client.lang(`unban.message3`)}`);
        });

        let Embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setDescription(`${message.author} ${await client.lang(`unban.message4`)} [\`${bannedUser.username}\`](https://discord.com/users/${bannedUser.id})` || `${await client.lang(`unban.message2`)}`);

        message.guild.channels.cache.get(client.db.get(`modlogs_${message.guild.id}`))?.send({ embeds: [Embed] });
    }
};
