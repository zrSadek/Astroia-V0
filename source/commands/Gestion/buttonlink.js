const Discord = require('discord.js');
const Astroia = require('../../structures/client/index');
const ms = require('ms');

module.exports = {
    name: 'buttonlink',
    description: "Ajoute/supprime un bouton de décoration personnalisé sur un message du bot",

    /**
     * 
     * @param {Astroia} client 
     * @param {Discord.Message} message 
     * @param {Array} args
     * @param {String} commandName
     * 
     **/
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
        const action = args[0];
        const link = args[1];

        if (!action || !link) {
            return message.reply('Veuillez spécifier si vous voulez ajouter ou supprimer un bouton et fournir un lien pour le bouton.');
        }

      

        if (action === 'add') {
            try {
                const messageID = args[2];
                if (!messageID) {
                    return message.reply('Veuillez spécifier l\'ID du message auquel ajouter le bouton.');
                }
                const name = args[3] || 'Cliquez ici'
                const row = new Discord.ActionRowBuilder()
                    .addComponents(
                        new Discord.ButtonBuilder()
                            .setLabel(name)
                            .setStyle(Discord.ButtonStyle.Link)
                            .setURL(link)
                    );
                const channel = message.channel;
                const targetMessage = await channel.messages.fetch(messageID);
                if (!targetMessage) {
                    return message.reply('Le message avec l\'ID spécifié n\'a pas été trouvé.');
                }

                await targetMessage.edit({
                    components: [row],
                });

                message.reply(`Le bouton a été ajouté au message : ${targetMessage.url}`);
            } catch (error) {
                console.error('Erreur lors de l\'ajout du bouton :', error);
                message.reply(await client.lang('erreur'));
            }
        } else if (action === 'del') { 
            try {
                const messageID = args[1];
                if (!messageID) {
                    return message.reply('Veuillez spécifier l\'ID du message duquel supprimer le bouton.');
                }

                const channel = message.channel;
                const targetMessage = await channel.messages.fetch(messageID);
                if (!targetMessage) {
                    return message.reply('Le message avec l\'ID spécifié n\'a pas été trouvé.');
                }

                await targetMessage.edit({
                    components: [],
                });

                message.reply('Le bouton a été supprimé du message.');
            } catch (error) {
                console.error('Erreur lors de la suppression du bouton :', error);
                message.reply(await client.lang('erreur'));
            }
        } else {
            message.reply(`Action non valide. Utilisez \`${client.prefix}buttonlink add <lien> <ID_message>\` pour ajouter un bouton ou \`${client.prefix}buttonlink del <ID_message>\` pour le supprimer.`);
        }
    }
}
