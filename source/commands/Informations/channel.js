const { ChannelType, Permissions, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'channel',
    description: 'Affiche les informations relatives à un salon',
    usage: 'channel [salon]',
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
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.channel;

        if (!channel) {
            return message.reply('Veuillez fournir un salon valide.');
        }

        const embed = new EmbedBuilder()
            .setColor(client.color)
            .setTitle(`Informations sur le salon #${channel.name}`)
            .addFields({name: 'ID du Salon', value: `${channel.id}`})
            .addFields({name: 'Type de Salon', value: `${channel.type === 0 ? 'Text' : 'Vocal'}`})
            .addFields({name: 'Position du Salon',value: `${channel.rawPosition}`})
            .addFields({ name: 'Créé', value: `<t:${Math.floor(channel.createdTimestamp / 1000)}:R>` })
            .addFields({name: 'NSFW', value: `${channel.nsfw ? 'Oui' : 'Non'}`})
            .addFields({name: 'Salon Vocale', value: `${channel.type === 1 ? 'Oui' : 'Non'}`});

        if (channel.parent) {
            embed.addFields({name: 'Catégorie', value: `${channel.parent.name}`});
        }

        if (channel.type === 0) {
            embed.addFields({name: 'Nombre de Messages', value: `${channel.messages.cache.size}`});
        }

        message.reply({ embeds: [embed] });
    },
};
