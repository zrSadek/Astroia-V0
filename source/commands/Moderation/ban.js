const Discord = require('discord.js');

module.exports = {
    name: "ban",
    description: "Permet de bannir l'utilisateur mentionné",
    usages: "ban <utilisateur>",
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

       if (pass === false) {
    if (client.noperm && client.noperm.trim() !== '') {
        return message.channel.send(client.noperm);
    } else {
        return; 
    }
}

        let user = message.mentions.users.first();
        let memberId = args[0];

        if (!user && memberId) {
            try {
                user = await client.users.fetch(memberId);
            } catch (error) {
                console.error(error);
            }
        }

        if (!user) {
            return message.channel.send(await client.lang(`ban.message4`));
        }

        let reason = args.slice(1).join(' ') || `${await client.lang(`ban.aucuneraison`)}`;
        if (client.db.get(`owner_${user.id}`) === true || client.config.buyers.includes(user.id)) {
            return message.channel.send(`${await client.lang(`ban.pasbannir`)}`);
        }
        
            let sanction = {
                type: "ban",
                _id: Math.floor(Math.random() * 9999),
                user: user.id,
                reason: reason,
                date: new Date(),
                mod: message.author.id
            };
            let bannedUser;
            bannedUser = await client.users.fetch(user);

            message.guild.members.ban(user, { reason: reason }).then(async () => {
                message.channel.send(`**${bannedUser.username}** ${await client.lang(`ban.message1`)} \`${reason}\``);

                client.db.push(`sanctions_${message.guild.id}`, sanction);

                let embed = new Discord.EmbedBuilder()
                    .setColor(client.color)
                    .setDescription(`${message.author} ${await client.lang(`ban.message2`)} [\`${bannedUser.username}\`](https://discord.com/users/${user.id}) ${await client.lang(`ban.message3`)} \`${reason}\``);

                message.guild.channels.cache.get(client.db.get(`modlogs_${message.guild.id}`))?.send({ embeds: [embed] });
            });
        }
    }
