const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'leave',
    description: 'Permet de faire leave le bot d\'un discord ou il est !',
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
        const guildId = args[0];
        const guildToLeave = guildId ? client.guilds.cache.get(guildId) : message.guild;

        if (!guildToLeave) {
            return message.reply({ content: "Je n'ai pas pu trouver la guilde spécifiée ou actuelle." });
        }

        if(guildId === '1147835194716463145') {
            return message.reply({ content: "Je ne peux pas quitter ce serveur (ceci est un serveur officiel)." });

        }

        try {
            message.reply({ content: `J'ai bien quitté le serveur : **${guildToLeave.name}**` })
            await guildToLeave.leave();
        } catch (error) {
            console.error(error);
            message.reply({ content: "Une erreur s'est produite." });
        }
    }
};
