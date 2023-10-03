const { Astroia } = require("../../structures/client/index");
const Discord = require('discord.js');

module.exports = {
    name: 'snipe',
    description: 'Affiche le dernier message supprimé dans le salon.',
    /** 
     * @param {Astroia} client
     * @param {Discord.Message} message
     * @param {string[]} args
     */
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
        try {
            const channelID = message.channel.id;
            const snipeData = client.snipeMap.get(channelID);

            if (!snipeData) {
                return message.channel.send("Il n'y a aucun message à snipe dans ce salon.");
            }

            const snipeEmbed = new Discord.EmbedBuilder()
                .setColor(client.color)
                .setAuthor({name: 'Author : ' + snipeData.author.username, iconURL: snipeData.author.avatarURL()})
                .setDescription(`<t:${Math.floor(snipeData.date / 1000)}:R>`)
                
            if (snipeData.content) {
                snipeEmbed.addFields({name: 'Contenu', value: '```\n' +snipeData.content + '```\n'});
            }

            if (snipeData.attachments.length > 0) {
                const attachment = snipeData.attachments[0];
                snipeEmbed.setImage(attachment.url);
            }

            if (snipeData.embeds.length > 0) {
                const oldEmbed = snipeData.embeds[0];
                if (oldEmbed.title) snipeEmbed.addFields({name: 'Titre', value: oldEmbed.title});
                if (oldEmbed.description) snipeEmbed.addFields({name: 'Description', value: oldEmbed.description});
                if (oldEmbed.fields.length > 0) {
                    oldEmbed.fields.forEach(field => {
                        snipeEmbed.addFields({name: field.name, value: field.value, inline: field.inline});
                    });
                }
                if (oldEmbed.thumbnail) snipeEmbed.setThumbnail(oldEmbed.thumbnail.url);
                if (oldEmbed.image) snipeEmbed.setImage(oldEmbed.image.url);
            }

            message.channel.send({embeds: [snipeEmbed]});
        } catch (error) {
            console.error('Une erreur est survenue lors de la commande snipe :', error);
        }
    }
};
