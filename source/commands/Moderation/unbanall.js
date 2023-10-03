const Discord = require('discord.js');
const { Database } = require('quick.db'); // Assurez-vous d'importer correctement la base de données quick.db

module.exports = {
    name: 'unbanall',
    description: 'Unbanall tous les utilisateurs bannis.',
    usage: 'unbanall',
    run: async (client, message, commandName) => {
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
        const bans = await message.guild.bans.fetch();

        if (bans.size === 0) {
            return message.reply({ content: "Il n'y a aucun membre banni.", allowedMentions: { repliedUser: false } });
        }

        const unbanall = [];

        try {
            bans.forEach(async (ban) => {
                const user = ban.user;
                unbanall.push({ id: user.id}); 
                await message.guild.bans.remove(user.id);
            });

            client.db.set(`unbanall_${message.guild.id}`, unbanall);

            const embed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setDescription(`**${bans.size}** membres ont été débannis avec succès. Utilisez \`${client.prefix}cancelunbanall\` pour annuler.`)
                .setFooter(client.footer)
            message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
        } catch (error) {
            console.error(error);
            message.reply(await client.lang('erreur'));
        }
    }
};
