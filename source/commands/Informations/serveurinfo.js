const Discord = require('discord.js');

module.exports = {
    name: 'serveurinfo',
    aliases: ['si'],
    /**
       * 
       * @param {Astroia} client 
       * @param {Discord.Message} message
       * @param {string[]} args 
       */

    run: async (client, message, args, commandName) => {


        let pass = false
        let staff = client.staff
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
        const membersGuild = await message.guild.members.fetch();
        const channelsGuild = message.guild.channels.cache;
        const rolesGuild = message.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
        const emojisGuild = message.guild.emojis.cache;
        let humains = membersGuild.filter(h => !h.user.bot).size;
        let bots = membersGuild.filter(b => b.user.bot).size;
        let totalmembre = membersGuild.size;
        let owner = message.guild.members.cache.get(message.guild.ownerId);
        const embed = new Discord.EmbedBuilder()
            .setColor(client.color)
            .setFooter(client.footer)
            .setImage(message.guild.bannerURL({ size: 1024 }))
            .setThumbnail(message.guild.iconURL({ dynamic: true, size: 1024 }))
            .setTitle('Information de ' + message.guild.name)
            .setDescription(`
\`👑\` ${await client.lang('serveurinfo.owner')}   : \`${(await client.users.fetch(owner.id)).username}\` - [\`${owner.id}\`](https://discord.com/users/${owner.id})
\`📅\` ${await client.lang('serveurinfo.date')}    : <t:${Math.round(parseInt(message.guild.createdTimestamp) / 1000)}:D> à <t:${Math.round(parseInt(message.guild.createdTimestamp) / 1000)}:T> (<t:${Math.round(parseInt(message.guild.createdTimestamp) / 1000)}:R>)
\`⚫\` ${await client.lang('serveurinfo.emoji')}   : \`${emojisGuild.size}\`
\`🎭\` ${await client.lang('serveurinfo.role')}    : \`${rolesGuild.length}\`
\`🎩\` ${await client.lang('serveurinfo.humain')}  : \`${humains}\`
\`🤖\` ${await client.lang('serveurinfo.bot')}     : \`${bots}\`
\`💹\` ${await client.lang('serveurinfo.membre')}  : \`${totalmembre}\`
\`🔊\` ${await client.lang('serveurinfo.vocal')}   : \`${channelsGuild.filter(channel => channel.type === 2).size}\`
\`#\` ${await client.lang('serveurinfo.channel')}  : \`${channelsGuild.filter(channel => channel.type === 0).size}\`
\`💎\` ${await client.lang('serveurinfo.boost')}   : \`${message.guild.premiumSubscriptionCount || '0'}\`
\`💍\` ${await client.lang('serveurinfo.niveau')}  : \`${message.guild.premiumTier ? `Niveau ${message.guild.premiumTier}` : await client.lang('serveurinfo.nonniveau')}\`
`)
        return message.channel.send({ embeds: [embed] })
    }
}

