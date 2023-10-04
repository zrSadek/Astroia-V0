const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'invite',
    description: 'Affiche vos invitations.',
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

        if (pass === false) {
            if (client.noperm && client.noperm.trim() !== '') {
                return message.channel.send(client.noperm);
            } else {
                return;
            }
        }

            const invite = message.mentions.users.first() || await client.users.fetch(args[0]).catch(() => null) || message.author;
            const invitesData = await client.db.get(`invites_${invite.id}_${message.guild.id}`);

            if (!invitesData) {
                return message.channel.send("Vous n'avez aucune invitation.");
            }

            const embed = new EmbedBuilder()
                .setColor(client.color)
                .setTitle(`Vos invitations`)
                .setFooter(client.footer)
                .setDescription(`\`📮Total :\` **${invitesData.total + invitesData.bonus}**\n\`✅ Présents :\` **${invitesData.valid}**\n\`❌ Leave :\` **${invitesData.left}**\n\`🎯Bonus :\` **${invitesData.bonus}**`);
            message.channel.send({ embeds: [embed] });
        
    }
};
