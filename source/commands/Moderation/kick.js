const Discord = require('discord.js');

module.exports = {
    name: "kick",
    description: "Permet d'expulser l'utilisateur mentionné",
    usages: "kick <utilisateur>",
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
            return message.channel.send(await client.lang(`kick.user`));
        }

        let reason = args.slice(1).join(' ') || `${await client.lang(`kick.aucuneraison`)}`;
        
        if (client.db.get(`owner_${user.id}`) === true || client.config.buyers.includes(user.id)) {
            return message.channel.send(`${await client.lang(`kick.pasexpulser`)}`);
        }
        
        let sanction = {
            type: "kick",
            _id: Math.floor(Math.random() * 9999),
            user: user.id,
            reason: reason,
            date: new Date(),
            mod: message.author.id
        };

        let kickedUser;
        try {
            kickedUser = await client.users.fetch(user);
        } catch (error) {
            console.error(error);
        }
        message.guild.members.kick(user, reason).then(async () => {
            message.channel.send(`**${kickedUser.username}** ${await client.lang(`kick.kick`)} \`${reason}\``);

            client.db.push(`sanctions_${message.guild.id}`, sanction);

            let embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setDescription(`${message.author} ${await client.lang(`kick.akick`)} [\`${kickedUser.username}\`](https://discord.com/users/${user.id}) ${await client.lang(`kick.rkick`)} \`${reason}\``);

            message.guild.channels.cache.get(client.db.get(`modlogs_${message.guild.id}`))?.send({ embeds: [embed] });
        }).catch(async error => {
            console.error(error);
            message.channel.send(`${await client.lang(`erreur`)}`);
        });
    }
}
